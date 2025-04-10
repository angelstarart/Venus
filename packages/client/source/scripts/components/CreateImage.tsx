import type {FC} from 'react';
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_IMAGE } from '../graphql/mutations';

const CreateImage: FC = () => {
  const [prompt, setPrompt] = useState('');
  // const [image, setImage] = useState('');
  // const [loading, setLoading] = useState(false);

  const [createImage] = useMutation(CREATE_IMAGE, {
    onCompleted: (res) => {
      console.log(res)
      // if (res.chat.image) {
      //   setLoading(false);
      //   setImage(res.chat.image);
      // }
    },
    onError: (err) => {
      console.error(err);
    },
  });
  const handleChange = (e: {target: {value: string}}): void => {
    setPrompt(e.target.value);
  };

  const handleAsk: () => void = () => {
    // setLoading(true);
    createImage({ variables: { prompt } })
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
        {/*<textarea readOnly={true} value={loading ? 'Loading...' : image} />*/}
      </div>
    </section>
  );
};

export default CreateImage;
