import classes from "./MainNavBar.module.css";
import Modal from "../UI/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCommentAlt,
  faPlus,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import classes2 from "./ModalNav.module.css";
import NewPost from "../Post/NewPost";
import { useContext } from "react";
import AuthContext from "../../store/auth";
import { useHistory } from "react-router";
import url from "../../store/app-url";

const ModalNav = (props) => {
  const history = useHistory();
  const [showNewPost, setShowNewPost] = useState(false);
  const showNewPostHandler = () => {
    setShowNewPost(true);
  };
  const hidePostHandler = () => {
    setShowNewPost(false);
  };
  const [hasError, setHasError] = useState(false);

  const authCtx = useContext(AuthContext);

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
  });

  useEffect(async () => {
    const authToken = authCtx.token;
    //console.log(authCtx.userId);
    //console.log(authCtx.token);
    const fetchData = async () => {
      const response = await fetch(`${url}api/users/${authCtx.userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000/",
          "Access-Control-Allow-Credentials": "true",
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Could not fetch data!");
      }
      const data = await response.json();
      //console.log(data);

      //console.log("fetch success");
      return data;
    };

    try {
      const fetchUserData = await fetchData();
      //console.log(fetchUserData);
      setUserData(fetchUserData);
      return fetchUserData;
    } catch (error) {
      setHasError(true);
      alert(error.message);
    }
  }, [authCtx.token, authCtx.userId]);

  //console.log(userData);
  const username = `${userData.firstName}  ${userData.lastName}`;
  const avatar = `${userData.firstName.substring(
    0,
    1
  )} ${userData.lastName.substring(0, 1)}`;

  if (hasError) {
    return (
      <Modal onClose={props.onCloseInfoHandler}>
        <p>Something went wrong...</p>
        <div className={classes.footer}>
          <button className={classes.button} onClick={props.onCloseInfoHandler}>
            Close
          </button>
          <button className={classes.button} onClick={props.onLogoutHandler}>
            Logout
          </button>
        </div>
      </Modal>
    );
  }

  const toFriendPageHandler = () => {
    props.onCloseInfoHandler();
    history.push("/friends");
  };

  const toChatPageHandler = () => {
    props.onCloseInfoHandler();
    history.push("/chat");
  };

  return (
    <Modal onClose={props.onCloseInfoHandler}>
      <div className={classes["user-details"]}>
        <div className={classes["user-details-user"]}>
          <div className={classes.avatar}>{avatar}</div>
          <div className={classes.username}>{username}</div>
        </div>

        <button
          className={classes["detail-button"]}
          onClick={props.onShowUserDetailHandler}
        >
          {props.page}
        </button>
      </div>
      {!showNewPost && (
        <div className={classes.body}>
          <hr></hr>
          <div className={classes2.container} onClick={showNewPostHandler}>
            <div className={classes2.icon}>
              <FontAwesomeIcon icon={faPlus} />
            </div>
            <p>Share your feelings now!!</p>
          </div>
          <hr></hr>
          <div className={classes2.container} onClick={toFriendPageHandler}>
            <div className={classes2.icon}>
              <FontAwesomeIcon icon={faUserPlus} />
            </div>
            <p>Find New Friends!!</p>
          </div>
          <hr></hr>
          <div className={classes2.container} onClick={toChatPageHandler}>
            <div className={classes2.icon}>
              <FontAwesomeIcon icon={faCommentAlt} />
            </div>
            <p>Text your friends now!!</p>
          </div>
          <hr></hr>
        </div>
      )}

      {showNewPost && <NewPost hidePostHandler={hidePostHandler} />}

      {!showNewPost && (
        <div className={classes.footer}>
          <button className={classes.button} onClick={props.onCloseInfoHandler}>
            Close
          </button>
          <button className={classes.button} onClick={props.onLogoutHandler}>
            Logout
          </button>
        </div>
      )}
    </Modal>
  );
};

export default ModalNav;
