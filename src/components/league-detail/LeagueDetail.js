import "./LeagueDetail.css";
import React from "react";
import { Flag } from "semantic-ui-react";
import PropTypes from "prop-types";

const propTypes = {
  league_id: PropTypes.number.isRequired,
  season_id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  countryName: PropTypes.string.isRequired,
};

function LeagueDetail({ league_id, name, season_id, countryName }) {
  return (
    <div
      className="league-detail"
      data-league-id={league_id}
      data-season-id={season_id}
    >
      <Flag name={countryName.toLowerCase()} />
      <div className="league-name">{name}</div>
    </div>
  );
}

LeagueDetail.propTypes = propTypes;

export default LeagueDetail;
