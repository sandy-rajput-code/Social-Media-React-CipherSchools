import PostList from "../Post/PostList";
import classes from "./MainPage.module.css";

const MainPage = () => {
  return (
    <div className={classes.container}>
      <h1>News Feed</h1>
      <div className={classes.body}>
        <div className={classes.pusher}></div>
        <PostList />
        <div className={classes.pusher}></div>
      </div>
    </div>
  );
};

export default MainPage;
