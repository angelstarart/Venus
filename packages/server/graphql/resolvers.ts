import type {Request, Response} from "express";
import type {Algorithm, JwtPayload} from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import {GoogleGenerativeAI} from "@google/generative-ai";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  // verifyAuthenticationResponse,
} from '@simplewebauthn/server';

import type {
  GenerateRegistrationOptionsOpts,
  VerifyRegistrationResponseOpts,
  VerifiedRegistrationResponse,
  GenerateAuthenticationOptionsOpts,
  // VerifyAuthenticationResponseOpts,
  // VerifiedAuthenticationResponse,
} from '@simplewebauthn/server';

import type {
  AuthenticatorTransportFuture,
  // PublicKeyCredentialType
  // PublicKeyCredentialDescriptorJSON
  // AuthenticationResponseJSON,
  // AuthenticatorDevice,
  // RegistrationResponseJSON,
} from '@simplewebauthn/types';

import User from '../models/user';
// import Token from '../models/token';
import Chat from '../models/chat';

interface env {
  JWT_SECRET: string;
  NODE_ENV: string;
  OPENAI_API_KEY: string;
  GOOGLE_GEN_AI_KEY: string;
}

interface decoded {
  email: JwtPayload | string
}

interface device {
  credentialPublicKey: Uint8Array,
  credentialID: string,
  counter: number,
  transports: AuthenticatorTransportFuture[] | undefined
}

dotenv.config({path: '../../.env'});
const {JWT_SECRET, OPENAI_API_KEY, GOOGLE_GEN_AI_KEY} = process.env as unknown as env;

const genAI = new GoogleGenerativeAI(GOOGLE_GEN_AI_KEY);

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const resolvers = {
  Query: {
    async getUser(_: unknown, args: { email: string }): Promise<object> {
      const {email} = args;
      console.log(email, 69)

      return await User.findOne({email}) as object;
    },
    verifyToken(_: unknown, args: { token: string } ): JwtPayload | string {
      const {token} = args;
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log(decoded as decoded, 75)
      const email = (decoded as decoded).email;
      console.log(email, 78)
      return {decoded: email}
    },
    async generateAuthentication(_: unknown, args: { email: string }, ctx: { req: Request }): Promise<object> {
      const {email} = args;
      const user = await User.findOne({email: email});
      console.log(user, 83)
      const devices = user?.devices as device[];
      const opts: GenerateAuthenticationOptionsOpts = {
        timeout: 300000,
        allowCredentials: devices.map((dev) => ({
          id: dev.credentialID,
          type: 'public-key',
          transports: dev.transports,
        })),
        userVerification: 'preferred',
        rpID: ctx.req.hostname,
      };

      console.log(opts,96)

      const options = await generateAuthenticationOptions(opts);
      console.log(options, 99)

      // const {rpId, challenge, timeout, userVerification, extensions} = options;

      return {
        options: options
      }
    },
  },
  Mutation: {
    generateRegistration: async (
      _: never,
      args: { email: string, name: string },
      ctx: { req: Request, res: Response }): Promise<object> => {

      const {name, email} = args;

      const opts: GenerateRegistrationOptionsOpts = {
        rpName: name,
        rpID: ctx.req.hostname,
        // userID: result.id,
        userName: email,
        userDisplayName: name,
        timeout: 300000,
        attestationType: 'none',
        // excludeCredentials,
        authenticatorSelection: {
          residentKey: 'discouraged',
          userVerification: 'preferred'
        },
        supportedAlgorithmIDs: [-7, -257],
        // extensions,
      }
      console.log(opts, 109)
      const options = await generateRegistrationOptions(opts);
      console.log(options, 111)
      const url = ctx.req.protocol + '://' + ctx.req.get('host');
      const user = await User.create({
        name,
        email,
        // password: bcrypt.hashSync(password, salt),
      });
      console.log(user, 117)

      const token = jwt.sign(
        {id: user.id as string, email: user.email},
        JWT_SECRET as Algorithm,
        {expiresIn: '1d'},
      );
      console.log(token, 124)
      return {options: options, url: url, token: token}
    },
    verifyRegistration: async (
      _: unknown,
      args: { options: VerifyRegistrationResponseOpts, token: string },
      // ctx: {req: Request, res: Response}
    ): Promise<object> => {
      const {options, token} = args;
      console.log(options, 158)
      console.log(token, 159)
      // const url = ctx.req.protocol + '://' + ctx.req.get('host');
      // console.log(url)
      const verification: VerifiedRegistrationResponse = await verifyRegistrationResponse(options);
      console.log(verification, 163)
      const {verified, registrationInfo} = verification;
      console.log(verified,164)

      try {
        if (verified && registrationInfo) {
          // const decoded = jwt.verify(token, JWT_SECRET);
          // console.log(decoded, 168)
          const {credential} = registrationInfo;
          console.log(credential,171)
          // const devices: object[] = [];
          // const device = {
          //   credentialPublicKey,
          //   credentialID,
          //   counter,
          //   transports: options.response.response.transports,
          // }
          // devices.push(device)
          // console.log(devices, 178)
          // await User.findOneAndUpdate({email: (decoded as decoded).email}, {devices: devices});
        }

      } catch (err) {
        console.error(err)
      }

      return {verified: verified};
    },
    // generateAuthentication: async (_: unknown, args: {token: string}, ctx: {req: Request}): Promise<object> => {
    //   const {token} = args;
    //   console.log(ctx.req.hostname, 64)
    //   const decoded =  jwt.verify(token, JWT_SECRET);
    //   console.log(decoded, 65)
    //   const user = await User.findOne({email: (decoded as decoded).email});
    //   console.log(user, 67)
    //   const devices = user?.devices as device[];
    //   const opts: GenerateAuthenticationOptionsOpts = {
    //     timeout: 300000,
    //     allowCredentials: devices.map((dev) => ({
    //       id: dev.credentialID,
    //       type: 'public-key',
    //       transports: dev.transports,
    //     })),
    //     userVerification: 'preferred',
    //     rpID: ctx.req.hostname,
    //   };
    //
    //   console.log(opts,89)
    //
    //   const options = await generateAuthenticationOptions(opts);
    //   console.log(options, 92)
    //
    //   return {options: options}
    // },

    chat: async (_: unknown, args: { question: string }): Promise<object> => {
      const {question} = args;

      const model = genAI.getGenerativeModel({model: "gemini-pro"});
      const answer = await model
        .generateContent(question)
        .then((res) => {
          return res.response.text();
        })
        .catch((err: string) => {
          console.error(err, 227)
          throw new Error(err);
        });

      console.log(answer, 231)

      await Chat.create({
        question,
        answer,
      });
      return {
        answer: answer,
      };
    },
    createImage: async (_: unknown, args: { prompt: string }): Promise<object> => {
      const {prompt} = args;
      console.log(prompt, 240)

      const response = await openai.images.generate({
        prompt,
        n: 1,
        size: '1024x1024',
        response_format: 'b64_json',
      }).then((res) => {
        console.log(res, 247)
        return res;
      }).catch((err: string) => {
        console.error(err, 250)
        throw new Error(err);
      });
      console.log(response, 253)
      return {
        response: response
      }
    }
  },
};

export default resolvers;
