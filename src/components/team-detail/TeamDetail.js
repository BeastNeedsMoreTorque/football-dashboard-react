import React from "react";
import PropTypes from "prop-types";

const propTypes = {
  logo: PropTypes.string.isRequired,
  short_code: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  header: PropTypes.bool,
  style: PropTypes.object,
};

const defaultProps = { header: false, style: {} };

const style = {
  root: { display: "flex", alignItems: "center" },
  teamName: { marginTop: "0" },
  teamLogo: { width: "1.3rem", marginRight: "1rem" },
  header: { fontWeight: "600", fontSize: "1.6rem" },
  headerLogo: { width: "2rem", marginRight: "1.5rem" },
};

function TeamDetail({ logo, short_code, name, header, style: addStyle }) {
  return (
    <div style={{ ...style.root, ...addStyle }}>
      <img
        style={header ? style.headerLogo : style.teamLogo}
        src={logo}
        alt={`Logo of ${short_code}`}
        title={name}
      />
      <div
        style={header ? { ...style.teamName, ...style.header } : style.teamName}
      >
        {name}
      </div>
    </div>
  );
}

TeamDetail.propTypes = propTypes;
TeamDetail.defaultProps = defaultProps;

export default TeamDetail;
