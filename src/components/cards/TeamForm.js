import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { model } from "../../model/model";
import { useMatchStatus, useMatches, useTeams } from "../../model/selectors";
import { formatTeamName, getTeamURL } from "../../others/helper";
import { MAX_FORM_RESULTS } from "../../others/config";

import { Table } from "semantic-ui-react";
import TeamDetail from "../team-detail/TeamDetail";
import CardPlaceholder from "./CardPlaceholder";
import ResultStat from "./result-stat/ResultStat";

const propTypes = {
  currentLeague: PropTypes.string.isRequired,
  currentTeam: PropTypes.string.isRequired,
};

function TeamForm({ currentLeague, currentTeam: currentTeamName }) {
  const [status, setStatus] = useState(useMatchStatus(currentLeague)?.result);
  const matches = useMatches(currentLeague)?.result;
  const { teamsByName: teams } = useTeams(currentLeague);

  useEffect(() => {
    if (status === "IDLE") getData();

    // Unmount || Updated
    return () => setStatus("DONE");

    async function getData() {
      await model.getMatchResults(currentLeague);

      if (status !== "DONE") setStatus("UPDATED");
    }
  }, [status, currentLeague]);

  if (!matches || !teams) return <CardPlaceholder />;

  if (!matches.length)
    return <h3 style={{ marginTop: "1rem" }}>No Recent Match Results</h3>;

  const OpponentRow = [
    <Table.Cell key={0} className="header" width={2} children="Opponent" />,
  ];
  const ScoreRow = [
    <Table.Cell key={0} className="header" width={2} children="Result" />,
  ];
  const DateRow = [
    <Table.Cell key={0} className="header" width={2} children="Date" />,
  ];

  let wins = 0;
  let draws = 0;
  let losts = 0;

  matches
    .filter(
      (match) =>
        formatTeamName(match.home_team.name) === currentTeamName ||
        formatTeamName(match.away_team.name) === currentTeamName
    )
    .slice(-MAX_FORM_RESULTS)
    .forEach((match, index) => {
      const isHome = formatTeamName(match.home_team.name) === currentTeamName;
      const opponentName = isHome
        ? formatTeamName(match.away_team.name)
        : formatTeamName(match.home_team.name);

      let result;
      if (isHome) {
        if (match.stats.home_score > match.stats.away_score) result = "won";
        else if (match.stats.home_score < match.stats.away_score)
          result = "lost";
        else result = "draw";
      }
      // away
      else {
        if (match.stats.home_score < match.stats.away_score) result = "won";
        else if (match.stats.home_score > match.stats.away_score)
          result = "lost";
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
        <Table.Cell key={index + 1} className="team-cell">
          <Link to={getTeamURL({ ...teams[opponentName] })}>
            <TeamDetail {...teams[opponentName]} displayCode={true} />
          </Link>
        </Table.Cell>
      );

      ScoreRow.push(
        <Table.Cell key={index + 1} className={result}>
          {isHome
            ? `${match.stats.home_score} - ${match.stats.away_score}`
            : `${match.stats.away_score} - ${match.stats.home_score}`}
        </Table.Cell>
      );

      DateRow.push(
        <Table.Cell key={index + 1}>
          {match.match_start.split(" ")[0].slice(5)}
        </Table.Cell>
      );
    });

  return (
    <div className="team-form">
      <ResultStat wins={wins} draws={draws} losts={losts} />
      <Table celled={true} size="small" textAlign="center">
        <Table.Body>
          <Table.Row children={OpponentRow} />
          <Table.Row children={ScoreRow} />
          <Table.Row children={DateRow} />
        </Table.Body>
      </Table>
    </div>
  );
}

TeamForm.propTypes = propTypes;

export default TeamForm;
