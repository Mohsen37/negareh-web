import {
  makeVar,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";
const TOKEN = "TOKEN";
const DARK_MODE = "DARK_MODE";
export const isLoggedInVar = makeVar(Boolean(localStorage.getItem(TOKEN)));
export const darkModeVar = makeVar(Boolean(localStorage.getIte, DARK_MODE));
export const showEditProfile = makeVar(false);

export const enableDarkMode = () => {
  localStorage.setItem(DARK_MODE, "true");
  darkModeVar(true);
};
export const disableDarkMode = () => {
  localStorage.removeItem(DARK_MODE);
  darkModeVar(false);
};

export const logUserIn = (token) => {
  localStorage.setItem(TOKEN, token);
  isLoggedInVar(true);
};

export const logUserOut = () => {
  localStorage.removeItem(TOKEN);
  isLoggedInVar(false);
  // window.location.reload();
};

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: localStorage.getItem(TOKEN),
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      User: {
        keyFields: (obj) => `User:${obj.userName}`,
      },
    },
  }),
});
