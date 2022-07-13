import classes from "./MainNavBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState, useContext } from "react";
import AuthContext from "../../store/auth";
import { useHistory } from "react-router";
import ModalNav from "./ModalNav";
import logo from "../../img/logo.gif";
import { useLocation } from "react-router";
import { useRef } from "react";

const MainNavBar = () => {
  const userRef = useRef();
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  const location = useLocation();
  const [page, setPage] = useState("Details");

  const [openInfo, setOpenInfo] = useState(false);
  const onOpenInfoHandler = () => {
    setOpenInfo(true);
  };

  const onCloseInfoHandler = () => {
    setOpenInfo(false);
  };

  const onShowUserDetailHandler = () => {
    if (location.pathname === "/main") {
      history.push(`/details/${authCtx.userId}`);
      setPage("main");
    } else {
      history.push("/main");
      setPage("details");
    }
    setOpenInfo(false);
  };

  const onLogoutHandler = () => {
    authCtx.logout();
    history.push("/login");
  };

  const searchHandler = (event) => {
    event.preventDefault();
    const input = userRef.current.value;
    history.push(`/search/${input}`);
  };

  const toHomePageHandler = () => {
    history.push("/main");
  };

  return (
    <div className={classes["nav-bar"]}>
      <div className={classes.logo} onClick={toHomePageHandler}>
        <img src={logo} alt="logo"></img>
      </div>
      <form className={classes["search-bar"]} onSubmit={searchHandler}>
        <FontAwesomeIcon icon={faSearch} className={classes.icon} />
        <input type="text" ref={userRef}></input>
      </form>
      <div className={classes.burger} onClick={onOpenInfoHandler}>
        <div className={classes["burger-bar"]}></div>
        <div className={classes["burger-bar"]}></div>
        <div className={classes["burger-bar"]}></div>
      </div>
      {openInfo && (
        <ModalNav
          page={page}
          onShowUserDetailHandler={onShowUserDetailHandler}
          onCloseInfoHandler={onCloseInfoHandler}
          onLogoutHandler={onLogoutHandler}
          onOpenInfoHandler={onOpenInfoHandler}
        ></ModalNav>
      )}
    </div>
  );
};

export default MainNavBar;
