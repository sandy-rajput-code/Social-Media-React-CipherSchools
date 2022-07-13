import classes from "./FriendsList.module.css";

const FriendsList = (props) => {
  
  const outputFriendsList = props.friends.map((friend) => {
    const avatar = friend.nameOfBoxChat.substring(0,1);
  
    const changeBoxHandler = () => {
      props.setCurrentBox(friend.boxId);
    }

    const username = friend.nameOfBoxChat;
    return (
      <div className={classes.user} key={friend.boxId} onClick={changeBoxHandler}>
        <div className={classes.avatar}>{avatar}</div>
        <p>{username}</p>
      </div>
    );
  });

  return (
    <div className={classes.bar}>
      <div className={classes.heading}>
        <h2>Friends</h2>
      </div>
      <div>
        {outputFriendsList}
      </div>
    </div>
  );
};
export default FriendsList;
