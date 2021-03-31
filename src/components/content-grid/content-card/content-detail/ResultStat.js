import React from "react";
import PropTypes from "prop-types";
import { Segment } from "semantic-ui-react";

const propTypes = {
  wins: PropTypes.number.isRequired,
  draws: PropTypes.number.isRequired,
  losts: PropTypes.number.isRequired,
};

function ResultStat({ wins, draws, losts }) {
  const spanStyle = { fontSize: "1.1rem", marginRight: "0.7rem" };
  return (
    <Segment>
      <span style={{ ...spanStyle, backgroundColor: "lightcyan" }}>
        {wins} <small>W</small>
      </span>
      <span style={{ ...spanStyle, backgroundColor: "whitesmoke" }}>
        {draws} <small>D</small>
      </span>
      <span style={{ ...spanStyle, backgroundColor: "rgba(255, 240, 240)" }}>
        {losts} <small>L</small>
      </span>
      <span>in last {wins + draws + losts} matches</span>
    </Segment>
  );
}

ResultStat.propTypes = propTypes;

export default ResultStat;
