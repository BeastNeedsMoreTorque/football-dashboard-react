import "./TeamDetail.css";
import React from "react";
import PropTypes from "prop-types";

const propTypes = {
  leagueId: PropTypes.string,
  seasonId: PropTypes.string,
  team_id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  short_code: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
  size: PropTypes.string,
  displayCode: PropTypes.bool,
};
const defaultProps = {
  displayCode: false,
};

function TeamDetail({
  leagueId,
  seasonId,
  team_id,
  name,
  short_code,
  logo,
  size,
  displayCode,
}) {
  return (
    <div
      className="team-detail"
      data-team-id={team_id}
      data-team-code={short_code}
      data-league-id={leagueId}
      data-season-id={seasonId}
    >
      <img
        className="team-logo"
        src={logo}
        alt={`Logo of ${name}`}
        title={name}
        style={
          size === "small"
            ? { width: "1.3rem", marginRight: "0.5rem" }
            : { width: "1.3rem", marginRight: "1rem" }
        }
      />
      <div
        className="team-name"
        style={
          size === "small"
            ? { fontWeight: "normal", fontSize: "1rem", marginTop: "0" }
            : { marginTop: "0" }
        }
      >
        {displayCode ? short_code : name}
      </div>
    </div>
  );
}

TeamDetail.propTypes = propTypes;
TeamDetail.defaultProps = defaultProps;

export default TeamDetail;
