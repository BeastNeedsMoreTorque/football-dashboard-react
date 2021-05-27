import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { Table } from "semantic-ui-react";
import { getTeamURL } from "../../others/helper";

import CardPlaceholder from "./CardPlaceholder";
import TeamDetail from "../team-detail/TeamDetail";
import { useTeams, useStandings } from "../../model/selectors";

const propTypes = { currentLeague: PropTypes.string.isRequired };

// prettier-ignore
const config = { tableHeader: ["#", "Team", "Points", "Played", "W", "D", "L", "GS", "GA", "GD"] };

function Standings({ currentLeague }) {
  const standings = useStandings(currentLeague);
  const { teams } = useTeams(currentLeague);

  if (!standings || !teams) return <CardPlaceholder />;

  return (
    <div className="standings">
      <Table celled={true} size="small">
        <Table.Header className="header">
          <Table.Row>
            {config.tableHeader.map((text, i) => (
              <Table.HeaderCell key={i}>{text}</Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {standings.map((team, i) => (
            <Table.Row key={i}>
              <Table.Cell>{team.position}</Table.Cell>
              <Table.Cell
                className="team-cell"
                width={4}
                children={
                  <Link to={getTeamURL(teams[team.team_id])}>
                    <TeamDetail {...teams[team.team_id]} />
                  </Link>
                }
              />
              <Table.Cell>{team.points}</Table.Cell>
              <Table.Cell>{team.overall.games_played}</Table.Cell>
              <Table.Cell>{team.overall.won}</Table.Cell>
              <Table.Cell>{team.overall.draw}</Table.Cell>
              <Table.Cell>{team.overall.lost}</Table.Cell>
              <Table.Cell>{team.overall.goals_scored}</Table.Cell>
              <Table.Cell>{team.overall.goals_against}</Table.Cell>
              <Table.Cell>{team.overall.goals_diff}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

Standings.propTypes = propTypes;

export default Standings;
