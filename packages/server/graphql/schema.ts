import { gql } from 'graphql-tag';

const typeDefs = gql`
  scalar Date

  type User {
    id: ID!
    name: String
    email: String
    #    password: String
    createdAt: Date
  }
  type Decode {
    decoded: String!
  }
  type RP {
    id: String!
    name: String!
  }
  type CredentialUser {
    id: String!
    name: String!
    displayName: String!
  }
  type PubKey {
    alg: Int!
    type: String
  }
  type Selection {
    residentKey: String
    requireResidentKey: Boolean
  }
  type Extensions {
    credProps: Boolean
  }
  type PublicKeyCredentialCreationOptions {
    challenge: String
    rp: RP
    user: CredentialUser
    pubKeyCredParams: [PubKey]
    timeout: Int
    attestation: String
    authenticatorSelection: Selection
    extensions: Extensions
  }
  type RegistrationOptions {
    options: PublicKeyCredentialCreationOptions
    url: String
    token: String
  }
  type AllowCredentials {
    id: String
    type: String
    transports: [String]
  }
  type PublicKeyCredentialRequestOptions {
    timeout: Int
    allowCredentials: AllowCredentials
    userVerification: String
    rpID: String
    challenge: String
    extensions: Extensions
  }
  type GenAuthOpts {
    options: PublicKeyCredentialRequestOptions
  }
  type RegistrationInfo {
    fmt: String
    counter: Int
    aaguid: String
    credentialID: [Int]
    credentialPublicKey: [Int]
    attestationObject: [Int]
    credentialType: String
    userVerified: Boolean
    credentialDeviceType: String
    credentialBackedUp: Boolean
    origin: String
    rpID: String
  }
  type ResponseOpts {
    verified: Boolean
    registrationInfo: RegistrationInfo
  }
  type RegistrationResponse {
    options: ResponseOpts
  }
  type VerifiedResponse {
    verified: Boolean
  }

  type Chat {
    id: ID!
    answer: String
  }

  input GetUser {
    email: String!
  }
  input CredProps {
    rk: Boolean
  }
  input ClientExtensionResults {
    credProps: CredProps
  }
  input NestResponse {
    attestationObject: String
    authenticatorData: String
    clientDataJSON: String
    publicKey: String
    publicKeyAlgorithm: Int
    transports: [String]
  }
  input Response {
    authenticatorAttachment: String
    clientExtensionResults: ClientExtensionResults
    id: String
    rawId: String
    response: NestResponse
    type: String
  }
  input Credential {
    response: Response
    expectedChallenge: String
    expectedOrigin: String
    expectedRPID: String
    requireUserVerification: Boolean
  }

  type Query {
    getUser(email: String!): User
    verifyToken(token: String!): Decode
    generateAuthentication(email: String!): GenAuthOpts!
  }
  type Mutation {
    generateRegistration(name: String!, email: String!): RegistrationOptions!
    verifyRegistration(options: Credential, token: String!): VerifiedResponse!
#    generateAuthentication(token: String!): GenAuthOpts!
    chat(question: String!): Chat!
  }
`;

export { typeDefs };
