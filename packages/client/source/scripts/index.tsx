import React from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {ApolloClient, InMemoryCache, HttpLink} from '@apollo/client';
import {ApolloProvider} from "@apollo/client/react";
import App from './components/App';

const root = createRoot(document.getElementById('root') as Element);
const { NODE_ENV } = process.env;
console.log(NODE_ENV)

const generateUri = (): string => {
  return NODE_ENV === 'production'
    ? 'https://angellstar.art/graphql' :
    'http://localhost:3000/graphql';
};

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: generateUri(),
    credentials: 'include',
  }),
});

root.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>,
);
