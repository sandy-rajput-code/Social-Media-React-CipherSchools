import { faAngleDoubleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "./NewPost.module.css";
import Button from "../UI/Button";
import { useRef } from "react";
import { useState } from "react";
import { useContext } from "react";
import AuthContext from "../../store/auth";
import url from "../../store/app-url";

const NewPost = (props) => {
  const textInputRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [textareaIsFocused, setTextareaIsFocused] = useState(false);
  const [postIsValid, setPostIsValid] = useState(false);
  const authCtx = useContext(AuthContext);

  const postNewHandler = (event) => {
    event.preventDefault();
    const enteredText = textInputRef.current.value;

    if (enteredText.length <= 0) {
      setPostIsValid(false);
      alert("Post must have some content!!");
    }
    if (enteredText.length > 255) {
      setPostIsValid(false);
      alert("Your post is too long!!");
    }
    if (enteredText.length <= 255 && enteredText.length > 0) {
      setPostIsValid(true);
    }
    if (!postIsValid) {
      return;
    } else {
      setIsLoading(true);
      const userId = authCtx.userId;
      const authToken = authCtx.token;

      fetch(url+"api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000/main",
          "Access-Control-Allow-Credentials": "true",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          content: enteredText,
          userId: userId,
        }),
      })
        .then((res) => {
          setIsLoading(false);
          if (res.ok) {
            console.log("post successful");
            alert("Successful!!");
            props.hidePostHandler();
          }
        })
        .catch((error) => alert(error.message));
    }
  };

  const focusTextInput = () => {
    setTextareaIsFocused(true);
  };

  return (
    <div>
      <Button className={classes.button} onClick={props.hidePostHandler}>
        <FontAwesomeIcon icon={faAngleDoubleLeft} className={classes.icon} />
      </Button>
      <form onSubmit={postNewHandler}>
        <textarea
          placeholder="Share your feelings..."
          className={classes.textarea}
          ref={textInputRef}
          onFocus={focusTextInput}
        />

        <Button className={classes["button"]}>
          {isLoading ? "Posting" : "Post"}
        </Button>
      </form>
    </div>
  );
};

export default NewPost;


