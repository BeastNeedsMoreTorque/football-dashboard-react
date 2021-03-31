import "./TeamStandingDetail.css";
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Table } from "semantic-ui-react";
import TeamDetail from "../../../team-detail/TeamDetail";

const propTypes = { data: PropTypes.object.isRequired };

// prettier-ignore
const config = { tableHeader: ["#", "Team", "Points", "Diff", "Played", "W", "D", "L"] };

function TeamStandingDetail({ data }) {
  const { standingsData, teamsData, teamId } = data;
  const [currentTeam] = standingsData.filter(
    (team) => team.team_id === +teamId
  );

  useEffect(() => {
    document
      .querySelector(".team-standing-detail .current")
      .scrollIntoView({ block: "center" });
    window.scroll(0, 0);
  });

  return (
    <Table className="team-standing-detail" celled={true} size="small">
      <Table.Header className="header">
        <Table.Row>
          {config.tableHeader.map((text, i) => (
            <Table.HeaderCell key={i}>{text}</Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {standingsData.map((team, i) => (
          <Table.Row
            key={i}
            className={`${team.team_id === +teamId ? "current" : ""}`}
          >
            <Table.Cell>{team.position}</Table.Cell>
            <Table.Cell
              className="team-cell"
              children={
                <TeamDetail {...teamsData[team.team_id]} displayCode={true} />
              }
            />
            <Table.Cell width={2}>{team.points}</Table.Cell>
            <Table.Cell width={2}>
              {team.points - currentTeam.points > 0 ? "+" : ""}
              {team.points - currentTeam.points}
            </Table.Cell>
            <Table.Cell width={2}>{team.overall.games_played}</Table.Cell>
            <Table.Cell>{team.overall.won}</Table.Cell>
            <Table.Cell>{team.overall.draw}</Table.Cell>
            <Table.Cell>{team.overall.lost}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

TeamStandingDetail.propTypes = propTypes;

export default TeamStandingDetail;
