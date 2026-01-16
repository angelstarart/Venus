import React, { useCallback, useContext, useEffect, useState } from 'react';
import type {Dispatch, FC, SetStateAction, SyntheticEvent} from 'react';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import { startRegistration } from '@simplewebauthn/browser';
import type {VerifyRegistrationResponseOpts} from '@simplewebauthn/server';
import type {PublicKeyCredentialCreationOptionsJSON} from '@simplewebauthn/types';
import { GET_USER, VERIFY_TOKEN, GENERATE_AUTHENTICATION} from '../graphql/queries';
import { GENERATE_REGISTRATION, VERIFY_REGISTRATION} from '../graphql/mutations';
import {GlobalContext} from "../context/globalstate.tsx";

interface user {
  id: string,
  name: string,
  email: string
}

const Registration: FC = () => {
  const {state, dispatch} = useContext(GlobalContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState({});
  const [load, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [authenticate, setAuthenticate] = useState(false)
  const [options, setOptions] = useState<VerifyRegistrationResponseOpts>({
    response: {
      id: '',
      rawId: '',
      response: {
        attestationObject: '',
        authenticatorData: '',
        clientDataJSON: '',
        publicKey: '',
        publicKeyAlgorithm: 0,
        transports: []
      },
      clientExtensionResults: {
        credProps: {
          rk: false
        }
      },
      type: 'public-key'
    },
    expectedChallenge: '',
    expectedOrigin: '',
    expectedRPID: '',
    requireUserVerification: true,
  });

  const setToken = useCallback((t: string) => {
    dispatch({type: 'SetToken', payload: {token: t}})
  }, []);

  // const get = useCallback(async (e: string) => {
  //   console.log(e)
  //   await getUser({variables: {e}})
  // }, []);

  const [getUser] = useLazyQuery(GET_USER, {
    onCompleted: (res: {getUser: user | null}) => {
      console.log(res)
      setLoading(false);
      if (res.getUser) {
        console.log(authenticate)
        if (authenticate) {
          const email = res.getUser.email;
          generateAuthentication({variables: {email}})
            .then(r => {
              console.log(r)
            }).catch(e => {console.error(e)})
         } else {
          setRegistered(true);
        }
      } else {
        setConfirm(true);
      }
    },
    onError: (err) => {
      setLoading(false);
      setErrorMsg(err);
    },
  });

  const [verifyToken, { loading, error, data }] = useLazyQuery(VERIFY_TOKEN, {
    onCompleted: (res: {verifyToken: {decoded: string}}) => {
      console.log(res)
      const decoded = res.verifyToken.decoded;
      console.log(decoded)
      // if (decoded) {
      //   getUser({variables: {decoded}});
      // }
    },
    onError: (err) => {
      console.error(err)
    }
  })

  const [generateAuthentication] = useLazyQuery(GENERATE_AUTHENTICATION, {
    onCompleted: (response) => {
      console.log(response)
      // const genAuthOpts = response.generateAuthentication.options;
      // console.log(genAuthOpts)
      // const credential = startAuthentication(genAuthOpts);
      // console.log(credential)
    },
    onError: (err) => {
      console.error(err)
    }
  });

  const [generateRegistration] = useMutation(GENERATE_REGISTRATION, {
    onCompleted: (response: {generateRegistration: {options: PublicKeyCredentialCreationOptionsJSON, url: string, token: string}}): void => {
      console.log(response)
      setToken(response.generateRegistration.token);
      const genOpts = response.generateRegistration.options;
      console.log(genOpts)
      const credential = startRegistration(genOpts);
      console.log(credential)
      credential
        .then((res) => {
          console.log(res)
          options.response = res;
          options.expectedChallenge = genOpts.challenge;
          options.expectedOrigin = response.generateRegistration.url;
          options.expectedRPID = genOpts.rp.id;
          setOptions((prev) => ({...prev}));
        })
        .catch((err) => {
          console.error(err);
          // setErrorMsg(err)
        });
    },
    onError: (err): void => {
      setErrorMsg(err)
    }
  })

  const [verifyRegistration] = useMutation(VERIFY_REGISTRATION, {
    onCompleted: (res: {verifyRegistration: {verified: boolean}}): void => {
      console.log(res)
      if (res.verifyRegistration.verified) {
        setConfirm(false)
        setCompleted(true)
      }
    },
    onError: (err): void => {
      setErrorMsg(err)
    },
  });
  //
  // const [generateAuthentication] = useMutation(GENERATE_AUTHENTICATION, {
  //   onCompleted: (response) => {
  //     console.log(response)
  //     // const genAuthOpts = response.generateAuthentication.options;
  //     // console.log(genAuthOpts)
  //     // const credential = startAuthentication(genAuthOpts);
  //     // console.log(credential)
  //   },
  //   onError: (err) => {
  //     console.error(err)
  //   }
  // });

  const handleChange = (setter: Dispatch<SetStateAction<string>>) => (e: {target: {value: string}}): void => {
    setter(e.target.value);
  };

  const handleContinue = async (e: SyntheticEvent):Promise<void> => {
    e.preventDefault();
    setLoading(true);
    await getUser({ variables: { email } });
  };

  const handleRegister = async (e: SyntheticEvent):Promise<void> => {
    e.preventDefault();
    setLoading(true);
    await generateRegistration({ variables: { name, email } });
  };

  const handleAuthentication = async (e: SyntheticEvent):Promise<void> => {
    e.preventDefault();
    setAuthenticate(true);
    if (state.token) {
      const token = state.token;
      console.log(token)

      await verifyToken({ variables: { token } });
    }
  };

  useEffect(() => {
    console.log(options)
    if (options.expectedOrigin && state.token) {
      const token = state.token;
      console.log(token)
      verifyRegistration({ variables: { options, token } })
        .then((r) => console.log(r))
        .catch((err) => console.error(err));
    }
  }, [options]);

  useEffect(() => {
    console.log(errorMsg)
  }, [errorMsg]);

  useEffect(() => {
    console.log(loading)
  }, [loading]);

  useEffect(() => {
    console.log(error)
  }, [error]);

  useEffect(() => {
    console.log(data)
  }, [data]);

  useEffect(() => {
    console.log(completed)
  }, [completed]);

  useEffect(() => {
    console.log(authenticate)
  }, [authenticate]);


  return (
    <section className={'centering'}>
      <div>
        <h1>Registration</h1>
      </div>
      <div className={'frame'}>
        {registered ? (
          <div>This mail address is already registered</div>
        ) : confirm ? (
          <>
            <div>Would you like to register?</div>
            <div>
              <ul>
                <li>Name : {name}</li>
                <li>Mail Address : {email}</li>
                {/*<li>Password : {password}</li>*/}
              </ul>
            </div>
            <div className={'button'} onClick={handleRegister}>
              {load ? 'Sending...' : 'Register'}
            </div>
          </>
        ) : completed ? (
          <div>registered an account</div>
        ) : (
          <form onSubmit={handleContinue}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={handleChange(setName)}
            />
            <input
              type="email"
              placeholder="Mail Address"
              value={email}
              onChange={handleChange(setEmail)}
            />
            {/*<input*/}
            {/*  type="password"*/}
            {/*  placeholder="Password"*/}
            {/*  value={password}*/}
            {/*  onChange={handleChange(setPassword)}*/}
            {/*/>*/}
            {/*<span>{error || ''}</span>*/}
            <button type="submit">{load ? 'Sending...' : 'Continue'}</button>
          </form>
        )}
      </div>

      <div>
        <h1>Authentication</h1>
      </div>
      <div className={'frame'}>
        <form onSubmit={handleAuthentication}>
          <button type='submit'>Authenticate</button>
        </form>
      </div>
    </section>
  );
};

export default Registration;
