import "./TeamDetail.css";
import React from "react";
import PropTypes from "prop-types";

const propTypes = {
  team_id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  short_code: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
};

function TeamDetail({ team_id, name, short_code, logo }) {
  return (
    <div
      className="team-detail"
      data-team-id={team_id}
      data-team-code={short_code}
    >
      <img
        className="team-logo"
        src={logo}
        alt={`Logo of ${name}`}
        title={short_code}
      />
      <div className="team-name">{name}</div>
    </div>
  );
}

TeamDetail.propTypes = propTypes;

export default TeamDetail;
