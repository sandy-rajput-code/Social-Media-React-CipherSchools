import classes from "./ChatBox.module.css";
import Button from "../UI/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleRight } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import url from "../../store/app-url";

const ChatBox = (props) => {
  const [textState, setTextState] = useState("");
  const [messages, setMessages] = useState([]);
  const [counter, setCounter] = useState(0);
  const scrollRef = useRef();

  useEffect(async () => {
    if (props.boxId) {
      const response = await props.fetchData(
        url + "api/chat?chatbox=" + props.boxId
      );
      setMessages(response);
    }
    scrollRef.current.scrollIntoView({ behavior: "smooth" });
    //console.log(counter);
    counter <= 0 && setTimeout(() => setCounter((counter) => counter + 1), 2000);
    counter > 0 && setTimeout(() => setCounter((counter) => counter - 1), 2000);

  }, [props.boxId, props.fetchData, counter]);

  const outputMessages = messages.map((message) => {
    let className;
    let mesdiv;
    //console.log(props.userId);

    if (message.userId == props.userId) {
      className = `${classes.messages} ${classes["my-side"]}`;
      mesdiv = classes["mesdiv-right"];
    } else {
      className = `${classes.messages} ${classes["orther-side"]}`;
      mesdiv = classes["mesdiv-left"];
    }

    return (
      <div className={mesdiv} key={message.id}>
        <div className={className}>{message.text}</div>
      </div>
    );
  });

  const onSendMessageHandler = (event) => {
    event.preventDefault();
    //console.log(textState);
    const enteredMessage = textState;
    setTextState("");
    props.fetchData(url + "api/chat/message", "POST", {
      senderId: props.userId,
      chatBoxId: props.boxId,
      text: enteredMessage,
    });

    scrollRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const changeTextHandler = (event) => {
    setTextState(event.target.value);
  };

  useEffect(() => {}, []);

  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <h2>{props.boxName}</h2>
      </div>
      <div className={classes.body}>
        {outputMessages}

        <div className={classes.temp} ref={scrollRef}></div>
      </div>
      <form className={classes.form} onSubmit={onSendMessageHandler}>
        <input
          type="text"
          value={textState}
          onChange={changeTextHandler}
          disabled={props.boxId === ""}
        ></input>
        <Button>
          <FontAwesomeIcon icon={faArrowAltCircleRight} size="2x" />
        </Button>
      </form>
    </div>
  );
};
export default ChatBox;
