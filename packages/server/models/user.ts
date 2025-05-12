import { Schema, model } from 'mongoose';

interface IUser {
  name: string;
  email: string;
  devices: object[];
  // password: string;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      min: 2,
      max: 100,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      min: 6,
      max: 255,
      unique: true,
      required: true,
    },
    devices: [Object],
    // password: {
    //   type: String,
    //   min: 6,
    //   max: 1024,
    //   unique: false,
    //   required: true,
    // },
  },
  { timestamps: true },
);

const User = model<IUser>('user', userSchema);

export { User };
