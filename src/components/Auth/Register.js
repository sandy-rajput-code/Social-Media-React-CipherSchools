import classes from "./Form.module.css";
import Button from "../UI/Button";
import { useRef, useState } from "react";
import { useHistory } from "react-router";
import url from "../../store/app-url";

const Register = (props) => {
  const history = useHistory();
  const firstNameInputRef = useRef();
  const lastNameInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const repeatPasswordInputRef = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [emailHasError, setEmailHasError] = useState(false);
  const [passwordIsInValid, setPasswordIsInValid] = useState(false);
  const [thisPasswordInvalid, setThisPasswordInvalid] = useState(false);

  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const submitHandler = async (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    const enteredRepeatPassword = repeatPasswordInputRef.current.value;
    const enteredFirstName = firstNameInputRef.current.value;
    const enteredLastName = lastNameInputRef.current.value;

    if (!validateEmail(enteredEmail)) {
      setEmailHasError(true);
    } else {
      setEmailHasError(false);
    }
    if (enteredRepeatPassword !== enteredPassword) {
      setPasswordIsInValid(true);
    } else {
      setPasswordIsInValid(false);
    }
    if (enteredPassword.length < 6) {
      setThisPasswordInvalid(true);
    } else {
      setThisPasswordInvalid(false);
    }

    if (
      !validateEmail(enteredEmail) ||
      enteredRepeatPassword !== enteredPassword ||
      enteredPassword.length < 6
    ) {
      console.log("INVALID ALL");
      alert("invalid input");
      return;
    } else {
      setIsLoading(true);
      await fetch(url + "api/v1/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000",
          "Access-Control-Allow-Credentials": "true",
        },
        body: JSON.stringify({
          firstName: enteredFirstName,
          lastName: enteredLastName,
          email: enteredEmail,
          password: enteredPassword,
        }),
      })
        .then((res) => {
          setIsLoading(false);
          if (res.ok) {
            history.replace("/confirm");
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
        .catch((err) => {
          setIsLoading(false);
          alert("failed! " + err.message);
        });
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <label htmlFor="name">First Name</label>
      <input type="text" id="name" ref={firstNameInputRef} required></input>

      <label>Last Name</label>
      <input type="text" id="firstname" ref={lastNameInputRef} required></input>

      <label>email</label>
      <input type="text" id="email" ref={emailInputRef} required />
      {emailHasError && (
        <p style={{ color: "crimson" }}>Please enter a valid email</p>
      )}
      <label htmlFor="password">password</label>
      <input
        type="password"
        id="password"
        ref={passwordInputRef}
        required
      ></input>
      {thisPasswordInvalid && (
        <p style={{ color: "crimson" }}>
          password must have more than than 6 character
        </p>
      )}
      <label htmlFor="repeatPassword">repeat password</label>
      <input
        type="password"
        id="repeatPassword"
        ref={repeatPasswordInputRef}
        required
      ></input>
      {passwordIsInValid && (
        <p style={{ color: "crimson" }}>repeat password must be the same</p>
      )}
      {!isLoading && (
        <div className={classes["btn-container"]}>
          <Button onClick={props.switchHandler} className={classes.button}>
            Login
          </Button>
          <Button className={classes.button}>Submit </Button>
        </div>
      )}
      {isLoading && <p>Sending request...</p>}
    </form>
  );
};
export default Register;
