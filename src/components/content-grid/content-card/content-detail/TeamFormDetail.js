import "./TeamFormDetail.css";
import React from "react";
import PropTypes from "prop-types";
import { Table } from "semantic-ui-react";
import ResultStat from "./ResultStat";
import TeamDetail from "../../../team-detail/TeamDetail";

const propTypes = {
  data: PropTypes.object.isRequired,
};

function TeamFormDetail({ data }) {
  const { matchesData, teamsDataByName, teamCode } = data;

  const OpponentRow = [
    <Table.Cell className="header" width={2} children="Opponent" />,
  ];
  const ScoreRow = [
    <Table.Cell className="header" width={2} children="Result" />,
  ];
  const DateRow = [<Table.Cell className="header" width={2} children="Date" />];

  let wins = 0;
  let draws = 0;
  let losts = 0;

  matchesData.forEach((match, index) => {
    const isHome = match.home_team.short_code === teamCode;
    const opponentName = isHome ? match.away_team.name : match.home_team.name;

    let result;
    if (isHome) {
      if (match.stats.home_score > match.stats.away_score) result = "won";
      else if (match.stats.home_score < match.stats.away_score) result = "lost";
      else result = "draw";
    }
    // away
    else {
      if (match.stats.home_score < match.stats.away_score) result = "won";
      else if (match.stats.home_score > match.stats.away_score) result = "lost";
      else result = "draw";
    }

    switch (result) {
      case "won":
        wins++;
        break;
      case "lost":
        losts++;
        break;
      default:
        draws++;
    }

    OpponentRow.push(
      <Table.Cell key={index} className="team-cell">
        <TeamDetail {...teamsDataByName[opponentName]} displayCode={true} />
      </Table.Cell>
    );

    ScoreRow.push(
      <Table.Cell key={index} className={result}>
        {isHome
          ? `${match.stats.home_score} - ${match.stats.away_score}`
          : `${match.stats.away_score} - ${match.stats.home_score}`}
      </Table.Cell>
    );

    DateRow.push(
      <Table.Cell key={index}>
        {match.match_start.split(" ")[0].slice(5)}
      </Table.Cell>
    );
  });

  return (
    <>
      <ResultStat wins={wins} draws={draws} losts={losts} />
      <Table
        className="team-form-detail"
        celled={true}
        size="small"
        textAlign="center"
      >
        <Table.Body>
          <Table.Row children={OpponentRow} />
          <Table.Row children={ScoreRow} />
          <Table.Row children={DateRow} />
        </Table.Body>
      </Table>
    </>
  );
}

TeamFormDetail.propTypes = propTypes;

export default TeamFormDetail;
