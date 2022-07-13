import classes from "./Comment.module.css";

const Comment = (props) => {
  const avatar = props.username.substring(0, 1);
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes["user-avatar"]}>{avatar}</div>
        <div>{props.username}</div>
      </div>
    
      <div className={classes["comment-box"]}>{props.text}</div>
    </div>
  );
};
export default Comment;
