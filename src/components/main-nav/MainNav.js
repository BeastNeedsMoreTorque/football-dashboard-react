import "./MainNav.css";
import React from "react";

function MainNav(props) {
  return <nav className="main-nav">{props.children}</nav>;
}

export default MainNav;
