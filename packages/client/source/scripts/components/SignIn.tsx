import React, {useEffect, useState} from 'react';
import {useMutation} from '@apollo/client';
import {SIGN_IN_USER} from '../graphql/mutations';
// import style from '../../styles/scss/main.module.scss';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const [signInUser] = useMutation(SIGN_IN_USER, {
    onCompleted: (res: any) => {
      if (res?.signInUser.isAuthenticated) {
        window.location.href = '/';
      }
    },
    onError: (err: any) => {
      setError(err)
    },
  });

  const handleChange = (setter: any) => (e: any) => {
    setter(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    await signInUser({variables: {email, password}});
  };

  useEffect(() => {
    console.log(error)
  }, [error])

  return (
    <section className={'style.centering'}>
      <h1>Sign In</h1>
      <div className={'style.frame'}>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Mail Address"
            value={email}
            onChange={handleChange(setEmail)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={handleChange(setPassword)}
          />
          <button type="submit">
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default SignIn;
