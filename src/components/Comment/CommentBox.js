import Modal from "../UI/Modal";
import CommentForm from "./CommentForm";
import classes from "./CommentBox.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useEffect, useState } from "react";
import { useContext } from "react";
import AuthContext from "../../store/auth";
import React from "react";
import Comment from "./Comment";
import url from "../../store/app-url";

const CommentBox = (props) => {
  const [commentList, setCommentList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const authCtx = useContext(AuthContext);
  const [commentState, setCommentState] = useState("");
  const [commentIsValid, setCommentIsvalid] = useState(false);
  const onChangeCommentHandler = (current) => {
    setCommentState(current.target.value);
  };
  const authToken = authCtx.token;

  const fetchData = useCallback(
    async (url, method = "GET", body = null) => {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000/",
          "Access-Control-Allow-Credentials": "true",
          Authorization: `Bearer ${authToken}`,
        },
        body: body ? JSON.stringify(body) : null,
      });
      if (!response.ok) {
        throw new Error("could not send comment");
      }
      const data = await response.json();
      return data;
    },
    [authToken]
  );

  useEffect(async () => {
    setIsLoading(false);
    try {
      const commentsData = await fetchData(
        `${url}api/comment/${props.id}`
      );

      //console.log(commentsData);
      setCommentList(commentsData);
    } catch (error) {
      alert(error.message);
    }
  }, [isLoading, authCtx, fetchData, props]);

  const outputComments = commentList.map((comment) => {
    //console.log(comment);
    return <Comment username={comment.username} text={comment.text} />;
  });

  const submitHandler = async (event) => {
    event.preventDefault();
    const enteredComment = commentState;
    console.log();
    if (enteredComment.length <= 0) {
      setCommentIsvalid(false);
      alert("Comment must have some content!");
    }
    if (enteredComment.length >= 255) {
      setCommentIsvalid(false);
      alert("Comment too long");
    }
    if (enteredComment.length > 0 && enteredComment.length < 255) {
      setCommentIsvalid(true);
    }
    if (!commentIsValid) {
      
      return;
    } else {
      setCommentState("");
      console.log(commentIsValid);
      try {
        fetchData("http://localhost:8080/api/comment", "POST", {
          userId: authCtx.userId,
          postId: props.id,
          text: enteredComment,
        });
      } catch (error) {
        alert(error.message);
      }
      //console.log("COMM");
      setIsLoading(true);
    }
  };

  return (
    <Modal onClose={props.onClose}>
      <div className={classes.header}>
        <h2>Comments</h2>
        <button className={classes.button} onClick={props.onClose}>
          <FontAwesomeIcon icon={faTimes} size="2x" />
        </button>
      </div>
      <div className={classes.box}>{outputComments}</div>
      <CommentForm
        submitHandler={submitHandler}
        onChange={onChangeCommentHandler}
        value={commentState}
      />
    </Modal>
  );
};

export default CommentBox;
