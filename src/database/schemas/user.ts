import { Document, Schema, model } from "mongoose";
import { logger } from "#root/logger.js";
import { IUser } from "../interfaces/user.js";

import { LRUCache } from "../cache/cache.js";

const cache = new LRUCache<number, Document & IUser>(100);

const UserSchema: Schema = new Schema({
  _id: { type: Number, required: true },
  username: { type: String, required: true },
  locate_code: { type: String, required: true, default: "" },
  status_id: { type: Number, required: true, default: -1 },
  referral_id: { type: Number, required: false, default: undefined },
  daily: {
    streak: { type: Number, default: 0 },
    timestamp: Date,
  },
});

UserSchema.pre("save", function psave(this: Document & IUser, next) {
  cache.add(this._id, this);
  next();
});

const User = model<IUser>("User", UserSchema);

export default User;

export async function getUser(
  id: number,
): Promise<(Document & IUser) | undefined> {
  if (!id) {
    logger.error("User id is required.");
    return undefined;
  }

  const cached = cache.get(id);
  if (cached) return cached;

  const userDatabase = await User.findById(id);
  if (userDatabase) {
    cache.add(id, userDatabase);
  } else {
    logger.error("User is not register.");
    return undefined;
  }

  return userDatabase;
}

export function createUser(user: IUser): (Document & IUser) | undefined {
  if (!user || !user.id || !user.username) {
    logger.error("New user is required.");
    return undefined;
  }

  const userDatabase = new User({
    _id: user.id,
    username: user.username,
    locate_code: user.locate_code || "",
  });

  cache.add(user.id, userDatabase);
  return userDatabase;
}
