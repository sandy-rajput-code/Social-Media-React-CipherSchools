import classes from "./UserDetails.module.css";
import { useCallback, useContext, useEffect, useState } from "react";
import AuthContext from "../../store/auth";
import PostItem from "../Post/PostItem";
import { Fragment } from "react/cjs/react.production.min";
import { useParams } from "react-router";
import Button from "../UI/Button";
import Card from "../UI/Card";
import url from "../../store/app-url";

const UserDetails = () => {
  const { userId } = useParams();

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
  });
  const [hasError, setHasError] = useState(false);
  const [postList, setPostList] = useState([]);
  const [userConnection, setUserConnection] = useState("");

  const authCtx = useContext(AuthContext);
  const authToken = authCtx.token;
  const fetchData = useCallback(async (url, method = "GET", body = null) => {
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
      throw new Error("Could not fetch data!");
    }
    //console.log(response);
    const data = await response.json();

    //console.log(data);

    //console.log("fetch success");
    return data;
  }, []);

  useEffect(async () => {
    //console.log(authCtx.userId);
    //console.log(authCtx.token);

    try {
      const fetchUserData = await fetchData(`${url}api/users/${userId}`);

      console.log(fetchUserData);
      setUserData(fetchUserData);

      const fetchUserPosts = await fetchData(`${url}api/posts/${userId}`);

      const fetchUserConnection = await fetchData(
        `${url}api/friends/${userId}`
      );

      setUserConnection(fetchUserConnection.connectionStatus);
      console.log(fetchUserConnection.connectionStatus);
      setPostList(fetchUserPosts);

      return fetchUserData;
    } catch (error) {
      setHasError(true);
      alert(error.message);
    }
  }, [userId, authCtx, fetchData]);

  const avatar = `${
    userData.firstName && userData.firstName.substring(0, 1)
  }  ${userData.lastName && userData.lastName.substring(0, 1)}`;

  const postItems = postList.map((post) => {
    console.log(post);
    let isLiked = false;
    let isDisliked = false;

    if (post.userReact === "LIKE") {
      isLiked = true;
    } else if (post.userReact === "DISLIKE") {
      isDisliked = true;
    }

    return (
      <li key={post.postId}>
        <PostItem
          id={post.postId}
          username={`${post.userFirstName} ${post.userLastName}`}
          content={post.content}
          likesCount={post.likeCount}
          disLikesCount={post.dislikeCount}
          commentCount={post.commentCount}
          isLiked={isLiked}
          isDisliked={isDisliked}
        />
      </li>
    );
  });

  let buttonData = "";

  if (userConnection === "FRIEND") {
    buttonData = "Unfriend";
  } else if (userConnection === "REQUESTED") {
    buttonData = "Requested";
  } else if (userConnection === "NO CONNECTION") {
    buttonData = "Add Friend";
  } else if (userConnection === "SELF") {
    buttonData = "Home Page";
  }

  const connectionHandler = () => {
    if (userConnection === "FRIEND") {
      try {
        fetchData(`${url}api/friends/sendUnfriendRequest/${userId}`, "POST");
      } catch (error) {
        alert(error.message);
      }
      setUserConnection("NO CONNECTION");
    } else if (userConnection === "REQUESTED") {
      try {
        fetchData(`${url}api/friends/sendUnfriendRequest/${userId}`, "POST");
      } catch (error) {
        alert(error.message);
      }
      setUserConnection("NO CONNECTION");
    } else if (userConnection === "NO CONNECTION") {
      try {
        fetchData(`${url}api/friends/sendFriendRequest/${userId}`, "POST");
      } catch (error) {
        alert(error.message);
      }
      setUserConnection("REQUESTED");
    }
  };

  return (
    <Fragment>
      <div className={classes.container}>
        <div className={classes.background}></div>
        <Card className={classes.card}>
          <div className={classes.logo}>{avatar}</div>
          <div className={classes.name}>
            <h1>
              {userData.firstName} {userData.lastName}
            </h1>
          </div>
          <Button className={classes.button} onClick={connectionHandler}>
            {buttonData}
          </Button>
        </Card>
      </div>
      <h1 style={{ textAlign: "center" }}>All Posts</h1>

        
        <div
    
          className={classes.body}
        >
          <ul className={classes.list}>{postItems}</ul>
        </div>
        
      {hasError && <h3>Something went wrong...</h3>}
    </Fragment>
  );
};

export default UserDetails;
