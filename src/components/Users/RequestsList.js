import { useState } from "react";
import Button from "../UI/Button";
import classes from "./UserFriendsList.module.css";

import AuthContext from "../../store/auth";
import { useContext } from "react";

const RequestList = (props) => {
  const authCtx = useContext(AuthContext);
  const [text, setText] = useState("Accept");

  const fetchData = async (url, method = "GET", body = null) => {
    const authToken = authCtx.token;
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        // "Access-Control-Allow-Origin": "http://localhost:3000/",
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
  };

  const sendAcceptRequestHandler = () => {
    console.log(props.friend);
    try {
      fetchData(
        `http://localhost:8080/api/friends/sendAcceptRequest/${props.friend.userId}`,
        "POST"
      );
      setText("Accepted");
    } catch (error) {
      alert(error.message);
    }
  };

  const avatar = `${props.friend.firstName.substring(
    0,
    1
  )} ${props.friend.lastName.substring(0, 1)}`;

  return (
    <div key={props.friend.userId}>
      <div className={classes.user}>
        <div className={classes.avatar}>{avatar}</div>
        <p>{`${props.friend.firstName} ${props.friend.lastName}`}</p>
        <Button
          className={classes.button}
          onClick={sendAcceptRequestHandler}
          disabled={text === "Accepted"}
        >
          {text}
        </Button>
      </div>
      <hr></hr>
    </div>
  );
};

export default RequestList;
