import "./StandingsDetail.css";
import React from "react";
import PropTypes from "prop-types";
import { Table } from "semantic-ui-react";
import TeamDetail from "../../../team-detail/TeamDetail";

const propTypes = { data: PropTypes.object.isRequired };

// prettier-ignore
const config = { tableHeader: ["#", "Team", "Points", "Played", "W", "D", "L", "GS", "GA", "GD"] };

function StandingsDetail({ data }) {
  const { standingsData, teamsData } = data;
  return (
    <Table className="standings-detail" celled={true} size="small">
      <Table.Header className="header">
        <Table.Row>
          {config.tableHeader.map((text, i) => (
            <Table.HeaderCell key={i}>{text}</Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {standingsData.map((team, i) => (
          <Table.Row key={i}>
            <Table.Cell>{team.position}</Table.Cell>
            <Table.Cell
              className="team-cell"
              width={4}
              children={<TeamDetail {...teamsData[team.team_id]} />}
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
  );
}

StandingsDetail.propTypes = propTypes;

export default StandingsDetail;
