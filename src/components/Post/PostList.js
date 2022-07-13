import classes from "./PostList.module.css";
import PostItem from "./PostItem";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../../store/auth";
import url from "../../store/app-url";

const PostList = (props) => {
  const authCtx = useContext(AuthContext);
  const [postItems, setPostItems] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [isLoading,setIsLoading ] = useState(false);

  const authToken = authCtx.token;
  useEffect(async () => {

    const fetchData = async () => {
      setIsLoading(true);
      const response = await fetch(url + "api/posts/news-feed", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000/",
          "Access-Control-Allow-Credentials": "true",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Could not fetch data");
      }
      setIsLoading(false);
      const data = await response.json();
      return data;
    };

    try {
      const fetchPostsData = await fetchData();
      //console.log(fetchPostsData);
      setPostItems(fetchPostsData);
      return fetchPostsData;
    } catch (error) {
      setHasError(true);
    }
  }, [authToken]);

  const postList = postItems.map((post) => {
    //console.log(post);
    let isLiked = false;
    let isDisliked = false;

    if(post.userReact === "LIKE"){
      isLiked = true;
    }else if(post.userReact === "DISLIKE"){
      isDisliked = true;
    }
    
    return (
      <li key={post.postId} >
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

  return (
    <div className={classes.container}>
      {!hasError && !isLoading&& <ul className={classes.card}>{postList}</ul>}
      {hasError && <h1>Something went wrong</h1>}
      {isLoading && <h2>Loading...</h2>}
    </div>
  );
};

export default PostList;
