import { Fragment } from "react";
import { Link } from "react-router-dom";
import Header from "../Header/Header";
import Button from "../UI/Button";
import classes from "./ConfirmationEmailPage.module.css";
import logo from "../../img/logo.gif";

const ConfirmEmailPage = () => {
  return (
    <Fragment>
      <Header>
        <img className={classes.img} src={logo} alt="logo"></img>
        <h2>Green Social</h2>
      </Header>
      <div className={classes.container}>
        <h1>Please Confirm your email</h1>
        <Button className={classes.button}>
          <Link to="/login">To Login Page</Link>
        </Button>
      </div>
    </Fragment>
  );
};

export default ConfirmEmailPage;
