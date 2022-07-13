import { useState } from "react";

import Card from "../UI/Card";
import classes from "./Form.module.css";
import Login from "./Login";
import Register from "./Register";


const Form = () => {
  const [isRegister, setIsRegister] = useState(false);


  const switchHandler = () => {
    setIsRegister((prevState) => !prevState);
  };
  const onLoginHandler = () => {};
  const onRegisterHandler = () => {};

  return (
    <div className={classes.container}>
      <Card className={classes.form}>
        <div className={classes.header}>
          {isRegister && <h2>Register</h2>}
          {!isRegister && <h2>Login</h2>}
        </div>
        <div className={classes["form-body"]}>
          {!isRegister && (
            <Login
              onRegisterHandler={onRegisterHandler}
              switchHandler={switchHandler}
            ></Login>
          )}
          {isRegister && (
            <Register
              onLoginHandler={onLoginHandler}
              switchHandler={switchHandler}
            ></Register>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Form;
