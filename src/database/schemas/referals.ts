import { Schema, model, Document } from "mongoose";
import { logger } from "#root/logger.js";
import { IReferrals } from "../interfaces/referrals.js";
import { LRUCache } from "../cache/cache.js";

const cache = new LRUCache<number, Document & IReferrals>(100);

const ReferralsSchema: Schema = new Schema({
  _id: { type: Number, required: true },
  referrals: [
    {
      id: { type: Number, required: true },
    },
  ],
});

ReferralsSchema.pre("save", function psave(this: Document & IReferrals, next) {
  cache.add(this._id, this);
  next();
});

const Referrals = model<IReferrals>("Referrals", ReferralsSchema);

export default Referrals;

export async function getReferrals(
  id: number,
): Promise<(Document & IReferrals) | undefined> {
  if (!id) {
    logger.error("User referral Id is required.");
    return undefined;
  }

  const cached = cache.get(id);
  if (cached) return cached;

  const referralsDatabase = await Referrals.findById(id);
  if (referralsDatabase) {
    cache.add(id, referralsDatabase);
  } else {
    logger.error("Referral is not register.");
    return undefined;
  }

  return referralsDatabase;
}

export async function createReferral(
  id: number,
): Promise<(Document & IReferrals) | undefined> {
  if (!id) {
    logger.error("New user referral Id is required.");
    return undefined;
  }

  const referralsDatabase = new Referrals({
    _id: id,
  });

  cache.add(id, referralsDatabase);
  return referralsDatabase;
}
