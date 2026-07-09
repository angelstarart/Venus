import { Schema, model } from 'mongoose';

export interface IToken {
  tags: string[];
}

const tokenSchema = new Schema<IToken>({
  tags: [{ type: String }],
});

const Token = model<IToken>('x-access-token', tokenSchema);

export default Token;
