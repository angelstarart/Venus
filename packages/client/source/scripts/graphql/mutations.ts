import {gql} from '@apollo/client';

export const GENERATE_REGISTRATION = gql`
  mutation GenerateRegistration($name: String!, $email: String!) {
    generateRegistration(name: $name, email: $email ) {
      options {
        challenge
        rp {
          id
          name
        }
        user {
          id
          name
          displayName
        }
        pubKeyCredParams {
          alg
          type
        }
        timeout
        attestation
        authenticatorSelection {
          residentKey
          requireResidentKey
        }
        extensions {
          credProps
        }
      }
      url
      token
    }
  }
`;

export const VERIFY_REGISTRATION = gql`
  mutation VerifyRegistration($options: Credential, $token: String!) {
    verifyRegistration(options: $options, token: $token) {
      verified
    }
  }
`;

// export const GENERATE_AUTHENTICATION = gql`
//   mutation GenerateAuthentication($token: String!) {
//     generateAuthentication(token: $token) {
//       options {
//         timeout
//         allowCredentials {
//           id
//           type
//           transports
//         }
//         userVerification
//         rpID
//         challenge
//         extensions {
//           credProps
//         }
//       }
//     }
//   }
// `;

export const CHAT = gql`
  mutation Chat($question: String!) {
    chat(question: $question) {
      answer
    }
  }
`;

// export const CREATE_IMAGE = gql`
//   mutation CreateImage($prompt: String!) {
//     createImage(prompt: $prompt) {
//       response
//     }
//   }
// `;
