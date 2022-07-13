import Card from "../UI/Card";
import { faThumbsDown } from "@fortawesome/free-regular-svg-icons";
import { faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { faCommentAlt } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "./PostItem.module.css";
import Button from "../UI/Button";
import CommentBox from "../Comment/CommentBox";
import { useState } from "react";
import { useContext } from "react";
import AuthContext from "../../store/auth";
import url from "../../store/app-url";

const PostItem = (props) => {
  const [showComment, setShowComment] = useState(false);
  const [isLiked, setIsLiked] = useState(props.isLiked);
  const [isDisliked, setIsDisliked] = useState(props.isDisliked);
  const authCtx = useContext(AuthContext);
  const [tempLikeCount, setTempLikeCount] = useState(props.likesCount);
  const [tempDislikeCount, setDislikeCount] = useState(props.disLikesCount);

  const sendReact = async (url, method = "GET", body = null) => {
    const authToken = authCtx.token;
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
  };

  const likePostHandler = async () => {
    setTempLikeCount(prevState => prevState +1);
    if(isDisliked){
      setDislikeCount(prevState => prevState - 1);
    }
    setIsLiked(true);
    setIsDisliked(false);
    await sendReact(url+"api/react", "POST", {
      userId: authCtx.userId,
      postId: props.id,
      reactStatus: "LIKE",
    });
  };

  const disLikePostHandler = async () => {
    setIsDisliked(true);
    setIsLiked(false);
    setDislikeCount(prevState => prevState +1);
    if(isLiked){
      setTempLikeCount(prevState => prevState - 1)
    }
    await sendReact(url+"api/react", "POST", {
      userId: authCtx.userId,
      postId: props.id,
      reactStatus: "DISLIKE",
    });
  };

  const showCommentHandler = () => {
    setShowComment(true);
  };

  const hideCommentHandler = () => {
    setShowComment(false);
  };

  const likebtnClass = `${classes.button} ${
    isLiked && !isDisliked ? classes.focus : ""
  }`;
  //console.log(likebtnClass);
  const dislikebtnClass = `${classes.button} ${
    !isLiked && isDisliked ? classes.focus : ""
  }`;
  //console.log(dislikebtnClass);

  const avatar = props.username.substring(0, 1);
  return (
    <Card className={classes.card}>
      <div className={classes.header}>
        <div className={classes.logo}>{avatar}</div>
        <div className={classes.user}>{props.username}</div>
      </div>
      <div className={classes.content}>{props.content}</div>
      <div className={classes.footer}>
        <Button
          className={likebtnClass}
          onClick={likePostHandler}
          disabled={isLiked}
        >
          <FontAwesomeIcon icon={faThumbsUp} className={classes.icon} />
          <div>{tempLikeCount}</div>
        </Button>
        <Button
          className={dislikebtnClass}
          onClick={disLikePostHandler}
          disabled={isDisliked}
        >
          <FontAwesomeIcon icon={faThumbsDown} className={classes.icon} />
          <div>{tempDislikeCount}</div>
        </Button>
        <Button className={classes.button} onClick={showCommentHandler}>
          <FontAwesomeIcon icon={faCommentAlt} className={classes.icon} />
          <div>{props.commentsCount}</div>
        </Button>
      </div>
      {showComment && (
        <CommentBox id={props.id} onClose={hideCommentHandler}></CommentBox>
      )}
    </Card>
  );
};

export default PostItem;
