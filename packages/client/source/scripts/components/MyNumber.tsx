import React from 'react';
// import {withRouter} from 'react-router-dom';

// import style from '../../styles/scss/main.module.scss';
import number from '../../pdf/mynumber.pdf'

const MyNumber: React.FunctionComponent = () => {
    return (
        <div className={"style.h100"}>
            <div className={"style.content"}>
              <object
                data={number}
                type={'application/pdf'}
                width={'100%'}
                height={'100%'}
              />
            </div>
        </div>
    );
};

export default MyNumber;
