import type {Dispatch, FC, ReactNode} from 'react';
import React, {createContext, useReducer} from 'react';

type State = {
  token: string;
}

type Action = {
  type: 'SetToken';
  payload: {
    token: string;
  }
}

type Props = {
  children: ReactNode
}

const initialState = {
  token: ''
};

const reducer = (state: State, action: Action): State => {
  console.log(state)
  console.log(action)
  return {
    ...state,
    token: action.payload.token,
  };
};

const GlobalContext = createContext<{state: State, dispatch: Dispatch<Action>}>(
  {state: initialState, dispatch: () => {}}
);
const GlobalProvider: FC<Props> = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalContext.Provider value={{state, dispatch}}>
      {children}
    </GlobalContext.Provider>
  );
};

export {GlobalContext, GlobalProvider}
