import "./TopScorersDetail.css";
import React from "react";
import PropTypes from "prop-types";
import { Table } from "semantic-ui-react";
import TeamDetail from "../../../team-detail/TeamDetail";
import { formatName } from "../../../../others/helper.js";

const propTypes = {
  data: PropTypes.object.isRequired,
};

function TopScorersDetail({ data }) {
  const { topScorersData, teamsDataByName } = data;

  return (
    <Table className="top-scorers-detail" celled={true} size="small">
      <Table.Header className="header">
        <Table.Row>
          <Table.HeaderCell width={1} rowSpan="2">
            #
          </Table.HeaderCell>
          <Table.HeaderCell width={2} rowSpan="2">
            Team
          </Table.HeaderCell>
          <Table.HeaderCell width={4} rowSpan="2">
            Name
          </Table.HeaderCell>
          <Table.HeaderCell colSpan="4">Goals</Table.HeaderCell>
          <Table.HeaderCell width={3} rowSpan="2">
            Played
          </Table.HeaderCell>
          <Table.HeaderCell rowSpan="2">Goal per 90Min</Table.HeaderCell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell className="goals-overall" width={1}>
            Overall
          </Table.HeaderCell>
          <Table.HeaderCell width={1}>Home</Table.HeaderCell>
          <Table.HeaderCell width={1}>Away</Table.HeaderCell>
          <Table.HeaderCell width={1}>Penalty</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {topScorersData.map((p, i) => {
          const teamData = teamsDataByName[p.team.team_name];
          return (
            <Table.Row key={i}>
              <Table.Cell>{p.pos}</Table.Cell>
              <Table.Cell
                children={<TeamDetail {...teamData} displayCode={true} />}
              />
              <Table.Cell>{formatName(p.player.player_name)}</Table.Cell>
              <Table.Cell>{p.goals.overall}</Table.Cell>
              <Table.Cell>{p.goals.home}</Table.Cell>
              <Table.Cell>{p.goals.away}</Table.Cell>
              <Table.Cell>{p.penalties || "0"}</Table.Cell>
              <Table.Cell>
                {p.matches_played} Games, {p.minutes_played} min
              </Table.Cell>
              <Table.Cell>
                {((p.goals.overall / p.minutes_played) * 90).toFixed(2)}
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}

TopScorersDetail.propTypes = propTypes;

export default TopScorersDetail;
