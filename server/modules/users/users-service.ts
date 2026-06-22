import { connectDB } from "../../database/connection";
import { UserModel } from "../../database/models/user-model";
import type { QuizAnswer, UtmPayload } from "../../common/types";
import { AppError } from "../../common/errors";

export const usersService = {
  async findByEmail(email: string) {
    await connectDB();
    return UserModel.findOne({ email: email.toLowerCase().trim() });
  },

  async createUser(input: {
    email: string;
    name: string;
    utm: UtmPayload;
    quizAnswers?: QuizAnswer[];
  }) {
    await connectDB();
    const now = new Date();
    const email = input.email.toLowerCase().trim();

    const existing = await UserModel.findOne({ email });
    if (existing) {
      throw new AppError("User already exists", 409);
    }

    return UserModel.create({
      email,
      name: input.name.trim(),
      firstTouchSource: input.utm.source,
      firstTouchAt: now,
      lastTouchSource: input.utm.source,
      lastTouchAt: now,
      quizAnswers: input.quizAnswers ?? [],
    });
  },

  async updateLastTouch(userId: string, utm: UtmPayload) {
    await connectDB();
    return UserModel.findByIdAndUpdate(
      userId,
      {
        lastTouchSource: utm.source,
        lastTouchAt: new Date(),
      },
      { new: true },
    );
  },
};
