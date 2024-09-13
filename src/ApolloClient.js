import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import React from 'react';

// Initialize Apollo Client
const client = new ApolloClient({
  uri: 'http://localhost/scandiweb-ecommerce/public/index.php', //GraphQL server URI
  cache: new InMemoryCache(),
});

// Create a higher-order component to wrap your app with ApolloProvider
const ApolloApp = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloApp;
