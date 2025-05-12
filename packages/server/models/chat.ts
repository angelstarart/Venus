import { model, Schema } from 'mongoose';

interface IChat {
  question: string;
  answer: string;
}

const chatSchema = new Schema<IChat>(
  {
    question: {
      type: String,
      min: 1,
      max: 10000,
      unique: true,
      required: true,
    },
    answer: {
      type: String,
      min: 1,
      max: 10000,
      unique: true,
    },
  },
  { timestamps: true },
);

const Chat = model<IChat>('chat', chatSchema);

export { Chat };
