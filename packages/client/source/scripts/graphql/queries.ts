import { gql } from '@apollo/client';

export const GET_USER = gql`
  query GetUser($email: String!) {
    getUser(email: $email ) {
      id
      name
      email
    }
  }
`;

export const VERIFY_TOKEN = gql`
  query VerifyToken($token: String!) {
    verifyToken(token: $token) {
      decoded
    }
  }
`;

export const GENERATE_AUTHENTICATION = gql`
  query GenerateAuthentication($email: String!) {
    generateAuthentication(email: $email) {
      options {
        timeout
        allowCredentials {
          id
          type
          transports
        }
        userVerification
        rpID
        challenge
        extensions {
          credProps
        }
      }
    }
  }
`;
