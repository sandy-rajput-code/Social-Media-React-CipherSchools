import { Fragment, useContext } from "react";
import { Redirect, Route, Switch, useHistory } from "react-router";
import Header from "./components/Header/Header";
import MainNavBar from "./components/Header/MainNavBar";
import AuthContext from "./store/auth";
import React, { Suspense } from "react";
import MainPage from "./components/Pages/MainPage";
import Chat from "./components/Chat/Chat";

const PostList = React.lazy(() => import("./components/Post/PostList"));
const Form = React.lazy(() => import("./components/Auth/Form"));
const ConfirmEmailPage = React.lazy(() =>
  import("./components/Auth/ConfirmEmailPage")
);
const UserFriendsList = React.lazy(() =>
  import("./components/Users/UserFriendsList")
);
const SearchedUserList = React.lazy(() =>
  import("./components/Users/SearchedUserList")
);
const UserDetails = React.lazy(() => import("./components/Users/UserDetails"));

const App = () => {
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  return (
    <Fragment>
      <Suspense
        fallback={
          <div className="centered">
            <h2>Loading...</h2>
          </div>
        }
      >
        <Switch>
          <Route path="/" exact>
            {authCtx.isLoggedIn && <Redirect to="/main" />}
            {!authCtx.isLoggedIn && <Redirect to="/login" />}
          </Route>
          {authCtx.isLoggedIn ? (
            <Route path="/main">
              <Header>
                <MainNavBar></MainNavBar>
              </Header>
              <MainPage />
            </Route>
          ) : (
            history.replace("/login")
          )}
          {!authCtx.isLoggedIn && (
            <Route path="/login">
              <Form></Form>
            </Route>
          )}
          <Route path="/confirm">
            <ConfirmEmailPage />
          </Route>
          <Route path="/details/:userId">
            <Header>
              <MainNavBar></MainNavBar>
            </Header>
            <UserDetails />
          </Route>
          <Route path="/search/:inputName?">
            <SearchedUserList />
          </Route>
          <Route path="/friends">
            <Header>
              <MainNavBar></MainNavBar>
            </Header>
            <UserFriendsList />
          </Route>
          <Route path="/chat">
            <Header>
              <MainNavBar></MainNavBar>
            </Header>
            <Chat/>
          </Route>
          <Route>
            <Header></Header>
            <p>PAGE NOT FOUND</p>
          </Route>
        </Switch>
      </Suspense>
    </Fragment>
  );
};

export default App;
