import { createCallbackData } from "callback-data";

export const additionallyShootsData = createCallbackData(
  "additionally-shoots",
  {},
);

export const additionallyChannelData = createCallbackData(
  "additionally-channel",
  {
    id: Number,
  },
);

export const claimAdditionallyShootsData = createCallbackData(
  "additionally-claim",
  {},
);
