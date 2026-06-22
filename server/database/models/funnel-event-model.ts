import { Schema, models, model, type InferSchemaType } from "mongoose";
import type { FunnelStep } from "../../common/types";

const funnelEventSchema = new Schema(
  {
    sessionId: { type: String, required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    step: { type: String, required: true, index: true },
    source: { type: String, required: true, index: true },
    utmSource: String,
    utmMedium: String,
    utmCampaign: String,
    metadata: { type: Schema.Types.Mixed, default: {} },
    isReturningUser: { type: Boolean, default: false },
  },
  { timestamps: true },
);

funnelEventSchema.index({ step: 1, createdAt: -1 });

export type FunnelEventDocument = InferSchemaType<typeof funnelEventSchema> & {
  _id: Schema.Types.ObjectId;
  step: FunnelStep;
  createdAt: Date;
  updatedAt: Date;
};

export const FunnelEventModel =
  models.FunnelEvent || model("FunnelEvent", funnelEventSchema);
