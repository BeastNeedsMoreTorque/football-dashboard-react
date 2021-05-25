import "./ResultStat.css";
import React from "react";
import PropTypes from "prop-types";
import { Segment } from "semantic-ui-react";

const propTypes = {
  wins: PropTypes.number.isRequired,
  draws: PropTypes.number.isRequired,
  losts: PropTypes.number.isRequired,
};

function ResultStat({ wins, draws, losts }) {
  return (
    <Segment>
      <span className="stat won">
        {wins} <small>W</small>
      </span>
      <span className="stat draw">
        {draws} <small>D</small>
      </span>
      <span className="stat lost">
        {losts} <small>L</small>
      </span>
      <span>in last {wins + draws + losts} matches</span>
    </Segment>
  );
}

ResultStat.propTypes = propTypes;

export default ResultStat;
