import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import Login from "./screens/Login";
import NotFound from "./screens/NotFound";

import { GlobalStyle, lightTheme, darkTheme } from "./styles";
import "bootstrap-icons/font/bootstrap-icons.css";
import SignUp from "./screens/SignUp";
import { useReactiveVar, ApolloProvider } from "@apollo/client";
import { client, darkModeVar, isLoggedInVar } from "./apollo";
import routes from "./routes";
import { HelmetProvider } from "react-helmet-async";
import Home from "./screens/Home";
import Header from "./components/Header";
import Layout from "./components/Layout";

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const darkMode = useReactiveVar(darkModeVar);
  return (
    <div>
      <ApolloProvider client={client}>
        <HelmetProvider>
          <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <GlobalStyle />
            <Router>
              <Switch>
                <Route path={routes.home} exact>
                  {isLoggedIn ? (
                    <Layout>
                      <Home />
                    </Layout>
                  ) : (
                    <Login />
                  )}
                </Route>
                {!isLoggedIn ? (
                  <Route path={routes.signUp} exact>
                    <SignUp />
                  </Route>
                ) : null}
                <Route>
                  <NotFound />
                </Route>
              </Switch>
            </Router>
          </ThemeProvider>
        </HelmetProvider>
      </ApolloProvider>
    </div>
  );
}

export default App;
