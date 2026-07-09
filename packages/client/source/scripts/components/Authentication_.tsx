import React, { useContext, useEffect } from 'react';
import type {FC} from 'react';
import {GlobalContext} from "../context/globalstate.tsx";
// import { useMutation, useQuery } from '@apollo/client';
// import { startRegistration } from '@simplewebauthn/browser';
// import type {PublicKeyCredentialCreationOptionsJSON} from '@simplewebauthn/types'
// import { VERIFY_REGISTRATION } from '../graphql/mutations';
// import { GENERATE_REGISTRATION } from '../graphql/queries';

// interface generate {
//   generateRegistration : {
//     options: PublicKeyCredentialCreationOptionsJSON,
//     url: string
//   }
// }

const Authentication: FC = () => {
  const {state} = useContext(GlobalContext);
  // const { error, data } = useQuery<generate>(GENERATE_REGISTRATION);
  // const [verified, setVerified] = useState(false);
  // const [options, setOptions] = useState({
  //   response: {},
  //   expectedChallenge: '',
  //   expectedOrigin: '',
  //   expectedRPID: '',
  //   requireUserVerification: true,
  // });

  // const [verifyRegistration] = useMutation(VERIFY_REGISTRATION, {
  //   onCompleted: (res): void => {
  //     console.log(res)
  //     setVerified(res.verifyRegistration.options.verified);
  //   },
  //   onError: (err): void => {
  //     console.error(err);
  //   },
  // });

  // useEffect(() => {
  //   console.log(data)
  //   if (data?.generateRegistration) {
  //     const opts = data.generateRegistration.options;
  //     const credential = startRegistration(opts);
  //     console.log(credential)
  //     credential
  //       .then((res) => {
  //         options.response = res;
  //         options.expectedChallenge = opts.challenge;
  //         options.expectedOrigin = data.generateRegistration.url;
  //         options.expectedRPID = opts.rp.id as string;
  //         setOptions((prev) => ({ ...prev }));
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //       });
  //   }
  // }, [data, error]);
  //
  useEffect(() => {
    console.log(state)

  }, [state]);

  return (
    <div className={'centering'}>
      <div>authenticate</div>
      {/*{(() => {*/}
      {/*  const length = Object.keys(options.response).length;*/}
      {/*  console.log(length)*/}
      {/*  return (*/}
      {/*    <>*/}
      {/*      {verified ? (*/}
      {/*        <div>Authentication registered!</div>*/}
      {/*      ) : (*/}
      {/*        length > 0 && <div>Authentication failed</div>*/}
      {/*      )}*/}
      {/*    </>*/}
      {/*  );*/}
      {/*})()}*/}
    </div>
  );
};

export default Authentication;
