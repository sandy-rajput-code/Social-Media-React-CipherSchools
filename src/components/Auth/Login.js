import classes from "./Form.module.css";
import Button from "../UI/Button";
import { useRef, useContext, useState } from "react";
import AuthContext from "../../store/auth";
import { useHistory } from "react-router";
import url from "../../store/app-url";

const Login = (props) => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const authCtx = useContext(AuthContext);

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    setIsLoading(true);
    fetch(url + "api/v1/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": "true",
      },
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
      }),
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          ///console.log("here");
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = "Login failed";
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }

            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        ///console.log("here in second");
        const expirationTime = new Date(
          new Date().getTime() + 1000 * 60 * 60 * 10
        );
        //console.log(data.jwt);
        authCtx.login(data.jwt, expirationTime.toISOString(), data.userId);
        history.replace("/");
      })
      .catch((err) => {
        setIsLoading(false);
        alert(err);
      });
  };

  return (
    <form onSubmit={submitHandler}>
      <label htmlFor="email">email</label>
      <input type="email" id="email" ref={emailInputRef} required />
      <label htmlFor="password">password</label>
      <input type="password" id="password" required ref={passwordInputRef} />
      {!isLoading && (
        <div className={`${classes["btn-container"]} ${classes.login}`}>
          <Button type="submit" className={classes.button}>
            Submit
          </Button>
          <Button onClick={props.switchHandler} className={classes.button}>
            Register
          </Button>
        </div>
      )}
      {isLoading && <p>Sending Request...</p>}
    </form>
  );
};

export default Login;
