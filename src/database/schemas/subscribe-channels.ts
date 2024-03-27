import { Schema, model, Document } from "mongoose";
import { logger } from "#root/logger.js";
import { ISubscribeChannel } from "../interfaces/subscribe-channels.js";

const SubscribeChannelSchema: Schema = new Schema({
  _id: { type: Number, required: true },
  url: { type: String, required: true },
  name: { type: String, required: true },
  adding: { type: Number, required: true, default: 1 },
});

const SubscribeChannel = model<ISubscribeChannel>(
  "SubscribeChannels",
  SubscribeChannelSchema,
);

export default SubscribeChannel;

export async function getSubscribeChannel(
  id: number,
): Promise<(Document & ISubscribeChannel) | undefined> {
  if (!id) {
    logger.error("Channel Id is required.");
    return undefined;
  }

  const SubscribeChannelDatabase = await SubscribeChannel.findById(id);
  if (!SubscribeChannelDatabase) {
    logger.error("Channel is not register.");
    return undefined;
  }

  return SubscribeChannelDatabase;
}

export async function getAllSubscribeChannels(): Promise<
  Array<ISubscribeChannel> | undefined
> {
  const subscribeChannels =
    (await SubscribeChannel.find()) as Array<ISubscribeChannel>;

  return subscribeChannels;
}

export async function addSubscribeChannel(
  id: number,
  url: string,
  name: string,
  adding: number = 1,
): Promise<(Document & ISubscribeChannel) | undefined> {
  if (!id || !url || !name) {
    logger.error("New channel Id, url and name is required.");
    return undefined;
  }

  const SubscribeChannelDatabase = new SubscribeChannel({
    _id: id,
    url,
    name,
    adding,
  });
  if (SubscribeChannelDatabase) {
    await SubscribeChannelDatabase.save();
    return SubscribeChannelDatabase;
  }
  return undefined;
}

export async function removeSubscribeChannel(
  id: number,
): Promise<boolean | undefined> {
  if (!id) {
    logger.error("Channel Id to remove is required.");
    return undefined;
  }

  const SubscribeChannelDelete = await SubscribeChannel.deleteOne({ id });
  if (SubscribeChannelDelete) {
    return true;
  }
  return undefined;
}
