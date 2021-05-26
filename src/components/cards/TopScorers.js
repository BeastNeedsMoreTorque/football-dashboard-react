import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router";

import { model } from "../../model/model";
import { formatName, formatTeamName, getTeamURL } from "../../others/helper";

import { Table } from "semantic-ui-react";

import TeamDetail from "../team-detail/TeamDetail";
import CardPlaceholder from "./CardPlaceholder";
import { Link } from "react-router-dom";

const propTypes = {
  teams: PropTypes.object.isRequired,
};

function TopScorers({ teams }) {
  const [topScorersData, setTopScorersData] = useState(null);
  const { leagueName } = useParams();

  useEffect(() => {
    let ignore = false;
    getData();

    return () => (ignore = true);

    async function getData() {
      const topScorers = await model.getTopScorers(
        leagueName.replaceAll("-", " ")
      );

      if (!ignore) setTopScorersData(topScorers);
    }
  }, [leagueName]);

  if (!topScorersData) return <CardPlaceholder />;

  return (
    <Table className="top-scorers" celled={true} size="small">
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
          const teamData = teams[formatTeamName(p.team.team_name)];
          return (
            <Table.Row key={i}>
              <Table.Cell>{p.pos}</Table.Cell>
              <Table.Cell
                className="team-cell"
                children={
                  <Link to={getTeamURL({ ...teamData })}>
                    <TeamDetail {...teamData} displayCode={true} />
                  </Link>
                }
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

TopScorers.propTypes = propTypes;

export default TopScorers;
