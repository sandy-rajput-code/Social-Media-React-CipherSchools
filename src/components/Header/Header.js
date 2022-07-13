
import classes from "./Header.module.css";

const Header = (props) => {
  return <div className={classes.header}>{props.children}</div>;
};

export default Header;
