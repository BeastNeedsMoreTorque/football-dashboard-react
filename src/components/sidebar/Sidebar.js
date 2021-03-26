import "./Sidebar.css";
import React from "react";

function Sidebar(props) {
  return <aside className="sidebar">{props.children}</aside>;
}

export default Sidebar;
