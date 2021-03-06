import React, { Fragment, useEffect } from "react";
import LoginForm from "./components/auth/login-form/LoginForm";
import LandingPage from "./components/landing-page/LandingPage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SignupForm from "./components/auth/signup-form/SignupForm";
import { useSelector, useDispatch } from "react-redux";
import { refreshToken } from "./actions/auth";
import MainWrapper from "./components/main-wrapper/MainWrapper";
import Header from "./components/header/Header";
import { ThemeProvider } from "styled-components";
import GlobalStyle, { MainTheme } from "./GlobalStyle";
import Alerts from "./components/alerts/Alerts";
import "./styles.css";

const App = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshToken());
  }, []);

  return (
    <Fragment>
      <Router>
        <ThemeProvider theme={MainTheme}>
          <GlobalStyle />
          <Alerts />
          <Header />
          <Switch>
            <Route
              exact
              path="/"
              component={isAuthenticated ? MainWrapper : LandingPage}
            />
            <Route path="/createaccount" component={SignupForm} />
            <Route path="/login" component={LoginForm} />
          </Switch>
        </ThemeProvider>
      </Router>
    </Fragment>
  );
};

export default App;
