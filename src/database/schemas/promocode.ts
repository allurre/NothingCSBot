import { Schema, model, Document } from "mongoose";
import { logger } from "#root/logger.js";
import { IPromocode } from "../interfaces/promocode.js";

const PromocodeSchema: Schema = new Schema({
  _id: { type: String, required: true },
  activations: { type: Number, required: true },
  activated: { type: Number, required: true, default: 0 },
  express_at: { type: Date, required: true, default: new Date(0, 0) },
  count: { type: Number, required: true, default: 1 },
  type_id: { type: Number, required: true, default: 1 },
});

PromocodeSchema.methods.useage = async function promoUse() {
  this.activated += 1;
  await this.save({ validateBeforeSave: false });
};

const Promocode = model<IPromocode>("Promocode", PromocodeSchema);

export default Promocode;

export async function getPromocode(
  code: string,
): Promise<(Document & IPromocode) | undefined> {
  if (!code) {
    logger.error("Code is required.");
    return undefined;
  }

  const prommocodeDatabase = await Promocode.findById(code);
  if (prommocodeDatabase) {
    return prommocodeDatabase;
  }
  logger.error("Promocode is not found.");
  return undefined;
}

export async function createPromocode(
  code: string,
  activations: number,
  count: number,
  typeId: number,
  expressAt?: Date,
): Promise<(Document & IPromocode) | undefined> {
  if (!code || !activations || !count || !typeId) {
    logger.error("New promocode data is required.");
    return undefined;
  }

  const promocodeDatabase = new Promocode({
    _id: code,
    activations,
    uses: 0,
    express_at: expressAt || new Date(0, 0),
    count,
    type_id: typeId,
  });

  return promocodeDatabase;
}

export async function getAllActivePromocodes(): Promise<
  (Document & IPromocode)[] | undefined
> {
  const activePromocodesDatabase = await Promocode.find({
    uses: { $lt: "$activations" },
    express_at: { $lt: new Date() },
  });
  if (activePromocodesDatabase.length > 0) {
    return activePromocodesDatabase;
  }

  return undefined;
}

export async function getAllExpiredPromocodes(): Promise<
  (Document & IPromocode)[] | undefined
> {
  const expiredPromocodeDatabase = await Promocode.find({
    uses: { $eq: "$activations" },
    express_at: { $gte: new Date() },
  });

  if (expiredPromocodeDatabase.length > 0) {
    return expiredPromocodeDatabase;
  }

  return undefined;
}
