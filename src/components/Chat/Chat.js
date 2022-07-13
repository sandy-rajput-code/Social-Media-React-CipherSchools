import { useCallback, useEffect, useState } from "react";
import classes from "./Chat.module.css";
import ChatBox from "./Chatbox";
import FriendsList from "./FriendsList";
import AuthContext from "../../store/auth";
import { useContext } from "react";
import url from "../../store/app-url";

const Chat = () => {
  const authCtx = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [friendsList, setFriendsList] = useState([
    {
      nameOfBoxChat: "",
      boxId: "",
    },
  ]);
  const [currentBox, setCurrentBox] = useState({
    nameOfBoxChat: "",
    boxId: "",
  });

  const fetchData = useCallback(async (url, method = "GET", body = null) => {
    const authToken = authCtx.token;
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: body ? JSON.stringify(body) : null,
    });
    if (!response.ok) {
      throw new Error("could not send comment");
    }
    const data = await response.json();
    return data;
  }, []);

  useEffect(async () => {
    // setIsLoading(true);
    try {
      const fetchFriendsList = await fetchData(url + "api/chat/all-chat");
      setFriendsList(fetchFriendsList);
    } catch (error) {
      alert(error.message);
    }
  }, [fetchData, setFriendsList]);

  const setCurrentBoxHandler = (boxId) => {
    const currentBox = friendsList.find((friend) => friend.boxId === boxId);
    setCurrentBox(currentBox);
  };

  return (
    <div className={classes.container}>
      <FriendsList friends={friendsList} setCurrentBox={setCurrentBoxHandler} />
      <ChatBox
        boxName={currentBox.nameOfBoxChat}
        boxId={currentBox.boxId}
        fetchData={fetchData}
        userId={authCtx.userId}
        authToken={authCtx.token}
      />
    </div>
  );
};
export default Chat;
