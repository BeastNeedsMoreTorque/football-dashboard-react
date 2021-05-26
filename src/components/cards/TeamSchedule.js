import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useNames } from "../../hooks/useNames";

import { model } from "../../model/model";
import { formatTeamName, formatDate, getTeamURL } from "../../others/helper";

import { Table } from "semantic-ui-react";

import TeamDetail from "../team-detail/TeamDetail";
import CardPlaceholder from "./CardPlaceholder";

const propTypes = {
  teams: PropTypes.object.isRequired,
};

const config = {
  tableHeader: ["Schedule", "Opponent"],
};

function TeamSchedule({ teams }) {
  const [matchData, setMatchData] = useState(null);
  const { leagueName, teamName } = useNames(useParams());

  useEffect(() => {
    let ignore = false;
    getData();

    return () => (ignore = true);

    async function getData() {
      const matches = await model.getMatchUpcoming(leagueName);

      if (!ignore) setMatchData(matches);
    }
  }, [leagueName]);

  if (!matchData) return <CardPlaceholder />;

  if (!matchData.length)
    return <h3 style={{ marginTop: "1rem" }}>No Matches</h3>;

  return (
    <div className="team-schedule">
      <Table celled={true} size="small" textAlign="center">
        <Table.Header className="header">
          <Table.Row>
            {config.tableHeader.map((text, i) => (
              <Table.HeaderCell key={i}>{text}</Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {matchData
            .filter(
              (match) =>
                formatTeamName(match.home_team.name) === teamName ||
                formatTeamName(match.away_team.name) === teamName
            )
            .map((match, i) => {
              const isHome = formatTeamName(match.home_team.name) === teamName;
              const opponentName = isHome
                ? formatTeamName(match.away_team.name)
                : formatTeamName(match.home_team.name);

              return (
                <Table.Row key={i}>
                  <Table.Cell width={11} className="schedule">
                    {formatDate(match.match_start)}
                    <br />
                    <small
                      children={`@ ${match.venue?.name || "TBD"} (${
                        isHome ? "Home" : "Away"
                      })`}
                      style={{ fontSize: "90%" }}
                    />
                  </Table.Cell>
                  <Table.Cell
                    width={5}
                    className="team-cell"
                    children={
                      <Link to={getTeamURL({ ...teams[opponentName] })}>
                        <TeamDetail
                          {...teams[opponentName]}
                          displayCode={true}
                        />
                      </Link>
                    }
                  />
                </Table.Row>
              );
            })}
        </Table.Body>
      </Table>
    </div>
  );
}

TeamSchedule.propTypes = propTypes;

export default TeamSchedule;
