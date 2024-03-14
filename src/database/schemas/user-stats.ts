import { Schema, model, Document } from "mongoose";
import { logger } from "#root/logger.js";
import { IUserStats } from "../interfaces/user-stats.js";
import { LRUCache } from "../cache/cache.js";

const cache = new LRUCache<number, Document & IUserStats>(100);

const StatsSchema: Schema = new Schema({
  _id: { type: Number, required: true },
  shoots: { type: Number, required: true, default: 0 },
  headshots: { type: Number, required: true, default: 0 },
  earned: { type: Number, required: true, default: 0 },
});

StatsSchema.pre("save", function u(this: Document & IUserStats, next) {
  cache.add(this._id, this);
  next();
});

const Stats = model<IUserStats>("Stats", StatsSchema);

export default Stats;

export async function getStats(
  id: number,
): Promise<(Document & IUserStats) | undefined> {
  if (!id) {
    logger.error("Stats Id is required.");
    return undefined;
  }
  const statsId = -id;

  const cached = cache.get(statsId);
  if (cached) return cached;

  const statsDatabase = await Stats.findById(statsId);
  if (statsDatabase) {
    cache.add(statsId, statsDatabase);
  } else {
    logger.error("Stats is not register.");
    return undefined;
  }

  return statsDatabase;
}

export function createStats(id: number): (Document & IUserStats) | undefined {
  if (!id) {
    logger.error("New Stats Id is required.");
    return undefined;
  }
  const statsId = -id;

  const statsDatabase = new Stats({
    _id: statsId,
  });

  cache.add(statsId, statsDatabase);
  return statsDatabase;
}
