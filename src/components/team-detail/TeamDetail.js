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
      />
      <div className="team-name">{displayCode ? short_code : name}</div>
    </div>
  );
}

TeamDetail.propTypes = propTypes;
TeamDetail.defaultProps = defaultProps;

export default TeamDetail;
