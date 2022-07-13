import classes from "./UserFriendsList.module.css";
import Card from "../UI/Card";
import AuthContext from "../../store/auth";
import { useCallback, useContext, useEffect } from "react";
import { useState } from "react";
import RequestList from "./RequestsList";
import { useHistory } from "react-router";
import url from "../../store/app-url";

const UserFriendsList = () => {
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  const [friendsList, setFriendsList] = useState([
    {
      firstName: "",
      lastName: "",
    },
  ]);

  const [requestsList, setRequestsList] = useState([
    {
      firstName: "",
      lastName: "",
    },
  ]);

  const [inFriendsList, setInFriendList] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(
    async (url, method = "GET", body = null) => {
      setIsLoading(true);
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
        throw new Error("Could not fetch data!");
      }
      //console.log(response);
      const data = await response.json();

      //console.log(data);

      //console.log("fetch success");
      setIsLoading(false);
      return data;
    },
    [authCtx.token]
  );

  useEffect(async () => {
    try {
      const friendList = await fetchData(url + "api/friends/find-all-friends");
      const requestsList = await fetchData(
        url + "api/friends/find-all-request"
      );

      setFriendsList(friendList);
      setRequestsList(requestsList);
      console.log(requestsList);
      console.log(friendList);
    } catch (error) {
      console.log(error.message);
    }
  }, [setRequestsList, setFriendsList, fetchData]);

  const friendsListOutput =
    friendsList.length === 0 ? (
      <h2>No Friends Yet!!</h2>
    ) : (
      friendsList.map((friend) => {
        const showUserDetailHandler = () => {
          history.push(`/details/${friend.userId}`);
        };

        const avatar = `${friend.firstName.substring(
          0,
          1
        )} ${friend.lastName.substring(0, 1)}`;
        return (
          <div onClick={showUserDetailHandler} key={friend.userId}>
            <div className={classes.user}>
              <div className={classes.avatar}>{avatar}</div>
              <p>{`${friend.firstName} ${friend.lastName}`}</p>
            </div>
            <hr></hr>
          </div>
        );
      })
    );

  const requestListOutput = (!requestsList || requestsList.length === 0) ? (
    <h2>No request</h2>
  ) : (
    requestsList.map((friend) => {
      return <RequestList friend={friend} />;
    })
  );

  const changeToRequestPageHandler = () => {
    setInFriendList(false);
  };
  const changeFriendsPageHandler = () => {
    setInFriendList(true);
  };

  return (
    <div className={classes.container}>
      <Card className={classes.card}>
        <div className={classes.header}>
          <Card
            onClick={changeFriendsPageHandler}
            className={`${classes.tag} ${inFriendsList ? classes.focus : ""}`}
          >
            Friends List
          </Card>
          <Card
            onClick={changeToRequestPageHandler}
            className={`${classes.tag} ${!inFriendsList ? classes.focus : ""}`}
          >
            Requests
          </Card>
        </div>
        {inFriendsList && (
          <div className={classes.body}>
            {!isLoading && friendsListOutput}
            {isLoading && <h2>Loading...</h2>}
          </div>
        )}
        {!inFriendsList && (
          <div className={classes.body}>
            {!isLoading && requestListOutput} {isLoading && <h2>Loading...</h2>}
          </div>
        )}
      </Card>
    </div>
  );
};

export default UserFriendsList;
