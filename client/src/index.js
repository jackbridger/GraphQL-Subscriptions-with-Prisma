import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';

import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from "@apollo/react-hooks"
import { InMemoryCache } from 'apollo-cache-inmemory';

import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { HttpLink } from 'apollo-link-http';

// Run locally vs in development
// const httpURI = process.env.NODE_ENV === 'development' ? "http://localhost:4000" : 'https://to-do-gql-prisma.herokuapp.com/'
// const httpURI = 'https://to-do-gql-prisma.herokuapp.com/'
const httpURI = process.env.REACT_APP_HTTP_URI
// const wsURI = process.env.NODE_ENV === 'development' ? "ws://localhost:4000" : 'wss://to-do-gql-prisma.herokuapp.com/'
// const wsURI = 'wss://to-do-gql-prisma.herokuapp.com/'
const wsURI = process.env.REACT_APP_WS_URI

console.log(process.env.NODE_ENV)
// The http link is a terminating link that fetches GraphQL results from a GraphQL 
// endpoint over an http connection
const httpLink = new HttpLink({
    uri: httpURI
});

// Allow you to send/receive subscriptions over a web socket
const wsLink = new WebSocketLink({
    uri: wsURI,
    options: {
        reconnect: true
    }
});

// Acts as "middleware" for directing our operations over http or via web sockets
const terminatingLink = split(
    ({ query: { definitions } }) =>
        definitions.some(node => {
            const { kind, operation } = node;
            return kind === 'OperationDefinition' && operation === 'subscription';
        }),
    wsLink,
    httpLink
);
// Create a new client to make requests with, use the appropriate link returned 
// by termintating link (either ws or http)
const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: terminatingLink
});

ReactDOM.render(<ApolloProvider client={client}>
    <App />
</ApolloProvider>
    , document.getElementById('root'));

