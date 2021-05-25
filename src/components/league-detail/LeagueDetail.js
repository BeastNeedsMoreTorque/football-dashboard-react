import React from "react";
import PropTypes from "prop-types";
import { Flag } from "semantic-ui-react";

const propTypes = {
  name: PropTypes.string.isRequired,
  countryName: PropTypes.string.isRequired,
  header: PropTypes.bool,
};

const defaultProps = { header: false };

const style = {
  leagueName: { display: "inline-block", marginLeft: "0.5rem", color: "#333" },
  header: { fontWeight: "600", fontSize: "1.6rem", marginLeft: "0.8rem" },
};

function LeagueDetail({ name, countryName, header }) {
  return (
    <>
      <Flag name={countryName.toLowerCase()} />
      <div
        style={
          header ? { ...style.leagueName, ...style.header } : style.leagueName
        }
      >
        {name}
      </div>
    </>
  );
}

LeagueDetail.propTypes = propTypes;
LeagueDetail.defaultProps = defaultProps;

export default LeagueDetail;
