import "./MainHeader.css";
import React from "react";
import PropTypes from "prop-types";

const propTypes = { title: PropTypes.string.isRequired };

function MainHeader({ title }) {
  return (
    <header className="main-header">
      <h1 className="header-title">{title}</h1>
    </header>
  );
}

MainHeader.propTypes = propTypes;

export default MainHeader;
