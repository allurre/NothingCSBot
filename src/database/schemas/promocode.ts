import { Schema, model, Document } from "mongoose";
import { logger } from "#root/logger.js";
import { IPromocode } from "../interfaces/promocode.js";
import { LRUCache } from "../cache/cache.js";

const cache = new LRUCache<string, Document & IPromocode>(100);

const PromocodeSchema: Schema = new Schema({
  _id: { type: String, required: true },
  activations: { type: Number, required: true },
  uses: { type: Number, required: true, default: 0 },
  express_at: { type: Date, required: true, default: new Date(0, 0) },
  count: { type: Number, required: true, default: 1 },
  type_id: { type: Number, required: true, default: 1 },
});

PromocodeSchema.pre("save", function psave(this: Document & IPromocode, next) {
  cache.add(this._id, this);
  next();
});

PromocodeSchema.methods.useage = async function promoUse() {
  this.uses += 1;
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

  const cached = cache.get(code);
  if (cached) return cached;

  const prommocodeDatabase = await Promocode.findById(code);
  if (prommocodeDatabase) {
    cache.add(code, prommocodeDatabase);
  } else {
    logger.error("Promocode is not found.");
    return undefined;
  }

  return prommocodeDatabase;
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

  cache.add(code, promocodeDatabase);
  return promocodeDatabase;
}
