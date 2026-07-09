import type {FC} from 'react';
import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { CHAT } from '../graphql/mutations';

type ChatData = { chat: { answer: string } };
type ChatVars = { question: string };

const AI: FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const [chat] = useMutation<ChatData, ChatVars>(CHAT, {
    onCompleted: (res) => {
      if (res.chat.answer) {
        setLoading(false);
        setAnswer(res.chat.answer);
      }
    },
    onError: (err) => {
      console.error(err);
    },
  });
  const handleChange = (e: {target: {value: string}}): void => {
    setQuestion(e.target.value);
  };

  const handleAsk: () => void = () => {
    setLoading(true);
    chat({ variables: { question } })
      .then((r) => console.log(r))
      .catch((err) => console.error(err));
  };

  return (
    <section className={"centering"}>
      <div className={"frame"}>
        <textarea placeholder={'Ask me anything...'} onChange={handleChange} />
        <div className={"button"} onClick={handleAsk}>
          Ask
        </div>
        <textarea readOnly={true} value={loading ? 'Loading...' : answer} />
      </div>
    </section>
  );
};

export default AI;
