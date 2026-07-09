import type {SyntheticEvent} from 'react';
import React, {useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from '@emotion/styled';

import useDeviceDetection from '../hooks/useDeviceDetection';

const en = new URL('../../pdf/resume_e_Jun26.pdf', import.meta.url).href;
const ja = new URL('../../pdf/resume_j_Jun26.pdf', import.meta.url).href;
const zi = new URL('../../pdf/resume.zip', import.meta.url).href;

const Tabs = styled.div`
  position: relative;
  text-align: center;
  .tab {
    display: inline-block;
    height: 50px;
    line-height: 50px;
    font-size: 22px;
    width: 300px;
    cursor: pointer;
    [type='radio'] {
      display: none;
    }
    &.active {
      background-color: #535659;
      cursor: default;
    }
    label {
      cursor: pointer;
    }
  }
`;

const Download = styled.div `
  font-size: 20px;
  text-align: center;
  margin-top: 200px;
`

const Resume: React.FunctionComponent = () => {
  const urlParams = useParams<{ id: string }>();
  const [active, setActive] = useState<string>(urlParams.id as string || 'en');
  const navigate = useNavigate();
  const device = useDeviceDetection();

  const handleClick = async (e: SyntheticEvent): Promise<void> => {
    const index = (e.target as Element).id;
    if (index !== urlParams.id) {
      await navigate(`/resume/${index}`);
    }

    if (index !== active) {
      return setActive(index);
    }
  };

  useEffect(() => {
    if (urlParams.id === 'zi') {
      window.location.replace(zi);
    }
    console.log(urlParams)
  }, [urlParams])

  useEffect(() => {
    if (device === 'Mobile' || device === 'Tablet') {
      console.log(urlParams.id)
      if (urlParams.id === 'en') {
        window.location.replace(en);
      } else if (urlParams.id === 'ja') {
        window.location.replace(ja);
      }
    }
    console.log(device)
  }, [device])

  return (
    <div className={'h100'}>
      {
        active !== 'zi' ?
          <div className={'h100'}>
            {
              device === 'Desktop' &&
              <>
                <Tabs className={'tabs'}>
                  <div
                    className={active === 'en'
                      ? ['tab', 'active'].join(' ')
                      : 'tab'}
                  >
                    <input
                      type="radio"
                      id="en"
                      name="resume"
                      onClick={handleClick}
                    />
                    <label htmlFor="en">english</label>
                  </div>
                  <div
                    className={active === 'ja'
                      ? ['tab', 'active'].join(' ')
                      : 'tab'}>
                    <input
                      type="radio"
                      id="ja"
                      name="resume"
                      onClick={handleClick}
                    />
                    <label htmlFor="ja">japanese</label>
                  </div>
                </Tabs>
                <div style={{height: '100%'}}>
                  {active === 'en' ? (
                    <iframe
                      src={en}
                      width={'100%'}
                      height={'100%'}
                    />
                  ) : (
                    <iframe
                      src={ja}
                      width={'100%'}
                      height={'100%'}
                    />
                  )}
                </div>
              </>
            }
          </div>
          :
          <Download>
            Resume download complete
          </Download>
      }
    </div>
  );
};

export default Resume;
