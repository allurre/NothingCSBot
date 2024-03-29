import { Schema, model, Document } from "mongoose";
import { logger } from "#root/logger.js";
import { IUserSubscribeChannels } from "../interfaces/user-subscribe-channels.js";

const UserSubscribeChannelsSchema: Schema = new Schema({
  _id: { type: Number, required: true },
  channels: [{ type: Number, required: true }],
});

const UserSubscribeChannels = model<IUserSubscribeChannels>(
  "UserSubscribeChannels",
  UserSubscribeChannelsSchema,
);

export default UserSubscribeChannels;

export async function getUserSubscribeChannels(
  id: number,
): Promise<(Document & IUserSubscribeChannels) | undefined> {
  if (!id) {
    logger.error("User additionaly Id is required.");
    return undefined;
  }

  const UserSubscribeChannelsDatabase =
    await UserSubscribeChannels.findById(id);
  if (!UserSubscribeChannelsDatabase) {
    logger.error("User additionally is not register.");
    return undefined;
  }

  return UserSubscribeChannelsDatabase;
}

export function createUserSubscribeChannels(
  id: number,
): (Document & IUserSubscribeChannels) | undefined {
  if (!id) {
    logger.error("New user additionaly Id is required.");
    return undefined;
  }

  const UserSubscribeChannelsDatabase = new UserSubscribeChannels({
    _id: id,
    channels: [],
  });

  return UserSubscribeChannelsDatabase;
}
