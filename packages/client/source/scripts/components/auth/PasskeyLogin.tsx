import React, { useState } from 'react';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import styled from 'styled-components';

// Types
interface User {
  id: string;
  username: string;
  [key: string]: any;
}

interface PasskeyLoginProps {
  onLoginSuccess: (user: User) => void;
}

interface RegistrationOptions {
  challenge: string;
  rp: {
    name: string;
    id: string;
  };
  user: {
    id: string;
    name: string;
    displayName: string;
  };
  pubKeyCredParams: Array<{
    type: string;
    alg: number;
  }>;
  timeout: number;
  excludeCredentials?: Array<{
    id: string;
    type: string;
    transports?: string[];
  }>;
  authenticatorSelection?: {
    authenticatorAttachment?: string;
    requireResidentKey?: boolean;
    residentKey?: string;
    userVerification?: string;
  };
  attestation?: string;
}

interface AuthenticationOptions {
  challenge: string;
  timeout: number;
  rpId: string;
  allowCredentials?: Array<{
    id: string;
    type: string;
    transports?: string[];
  }>;
  userVerification?: string;
}

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 400px;
  backdrop-filter: blur(10px);
`;

const Title = styled.h1`
  color: #333;
  text-align: center;
  margin-bottom: 30px;
`;

const Button = styled.button`
  background: #6e8efb;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  font-size: 16px;
  margin: 10px 0;
  transition: all 0.3s ease;

  &:hover {
    background: #5c7cfa;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  text-align: center;
`;

const PasskeyLogin: React.FC<PasskeyLoginProps> = ({ onLoginSuccess }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');

  const handleRegister = async (): Promise<void> => {
    if (!username) {
      setError('Please enter a username first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. GET registration options from your server
      const resp = await fetch('/api/auth/registration-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });

      const options: RegistrationOptions = await resp.json();

      // 2. Pass options to browser's WebAuthn API
      const attResp = await startRegistration(options);

      // 3. Verify registration with your server
      const verificationResp = await fetch('/api/auth/verify-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          attestationResponse: attResp
        })
      });

      const verification = await verificationResp.json();

      if (verification.verified) {
        onLoginSuccess(verification.user);
      } else {
        setError('Verification failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError(`Registration failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (): Promise<void> => {
    if (!username) {
      setError('Please enter a username first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. GET authentication options from your server
      const resp = await fetch('/api/auth/authentication-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });

      const options: AuthenticationOptions = await resp.json();

      // 2. Pass options to browser's WebAuthn API
      const authResp = await startAuthentication(options);

      // 3. Verify authentication with your server
      const verificationResp = await fetch('/api/auth/verify-authentication', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          assertionResponse: authResp
        })
      });

      const verification = await verificationResp.json();

      if (verification.verified) {
        onLoginSuccess(verification.user);
      } else {
        setError('Authentication failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError(`Login failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <Card>
        <Title>Welcome to 3D Social</Title>

        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '20px',
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}
        />

        <Button onClick={handleLogin} disabled={loading}>
          {loading ? 'Processing...' : 'Login with Passkey'}
        </Button>

        <Button onClick={handleRegister} disabled={loading}>
          {loading ? 'Processing...' : 'Register New Passkey'}
        </Button>

        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Card>
    </LoginContainer>
  );
};

export default PasskeyLogin;