import { Fragment } from "react/cjs/react.production.min";
import Header from "../Header/Header";
import MainNavBar from "../Header/MainNavBar";
import Card from "../UI/Card";
import classes from "./SearchedUserList.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import AuthContext from "../../store/auth";
import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useParams } from "react-router";
import url from "../../store/app-url";


const SearchedUserList = () => {
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  const authToken = authCtx.token;
  const { inputName } = useParams();
  const [userList, setUserList] = useState([{ firstName: "", lastName: "" }]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(async () => {
    setIsLoading(true);
    const fetchUser = async () => {

      let link;
      if(!inputName || inputName.trim().length === 0){
        link = url+"api/users"
      }else{
        link = url + "api/users/find/" + inputName;
      }
      const response = await fetch(
        link,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "http://localhost:3000/",
            "Access-Control-Allow-Credentials": "true",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Could not fetch data!");
      }
      const data = await response.json();
      //console.log(data);

      //console.log("fetch success");
      return data;
    };

    try {
      const user = await fetchUser();
      console.log(user);
      setUserList(user);
    } catch (error) {
      alert(error.message);
    }
    setIsLoading(false);
  }, [inputName, authToken]);

  const onShowUserDetailsHandler = (userId) => {
    history.push(`/details/${userId}`);
  };

  let outputList;

  if (userList && userList.length > 0) {
    outputList = userList.map((user) => {
      let avatar = "";
      if(user.firstName && user.firstName.length >0 && user.lastName && user.lastName.length > 0){
          avatar = user.firstName.substring(0,1) + user.lastName.substring(0,1);
      }
      return (
        <Card className={classes["user-card"]} key={user.userId} onClick={onShowUserDetailsHandler.bind(null, user.userId)}>
          <div className={classes.avatar}>{avatar}</div>
          <h3>{`${user.firstName} ${user.lastName}`}</h3>
          <FontAwesomeIcon icon={faUserPlus} className={classes.icon} />
        </Card>
      );
    });
  } else {
    outputList = <h2>No user found</h2>;
  }

  return (

    <Fragment>
      <Header>
        <MainNavBar />
      </Header>
      {!isLoading && <div className={classes.container}>{outputList}</div>}
      {isLoading && <h2>Loading...</h2>}
    </Fragment>
  );
};
export default SearchedUserList;
