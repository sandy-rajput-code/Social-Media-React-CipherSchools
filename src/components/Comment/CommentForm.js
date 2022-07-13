import { faArrowAltCircleRight } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "./CommentForm.module.css";
import React from "react";
const CommentForm = (props) => {



  return (
    <form className={classes.form} onSubmit={props.submitHandler}>
      <textarea
        type="text"
        placeholder="comment something..."
        className={classes.input}
        onChange={props.onChange}
        value={props.value}
      ></textarea>
      <button className={classes.btn} >
        <FontAwesomeIcon
          icon={faArrowAltCircleRight}
          size="3x"
          className={classes.icon}
        />
      </button>
    </form>
  );
};

export default CommentForm;
