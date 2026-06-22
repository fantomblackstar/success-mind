import { Schema, models, model, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    firstTouchSource: { type: String, required: true },
    firstTouchAt: { type: Date, required: true },
    lastTouchSource: { type: String, required: true },
    lastTouchAt: { type: Date, required: true },
    quizAnswers: [
      {
        questionId: String,
        answer: String,
      },
    ],
  },
  { timestamps: true },
);

userSchema.index({ email: 1 });

export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const UserModel = models.User || model("User", userSchema);
