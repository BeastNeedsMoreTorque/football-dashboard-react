import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useNames } from "../../hooks/useNames";

import { model } from "../../model/model";
import { getTeamURL } from "../../others/helper";

import { Ref, Table } from "semantic-ui-react";

import TeamDetail from "../team-detail/TeamDetail";
import CardPlaceholder from "./CardPlaceholder";

const propTypes = {
  teams: PropTypes.object.isRequired,
  teamsByName: PropTypes.object.isRequired,
};

// prettier-ignore
const config = { tableHeader: ["#", "Team", "Points", "Diff", "Played", "W", "D", "L"] };

function TeamStanding({ teams, teamsByName }) {
  const [standingsData, setStandingsData] = useState(null);
  const { leagueName, teamName } = useNames(useParams());

  const currentTeam = standingsData?.filter(
    (team) => team.team_id === teamsByName[teamName].team_id
  )[0];
  const currentRef = useRef(null);

  useEffect(() => {
    let ignore = false;
    getData();

    return () => (ignore = true);

    async function getData() {
      const standings = await model.getStandings(leagueName);

      if (!ignore) setStandingsData(standings);
    }
  }, [leagueName]);

  useEffect(() => {
    if (currentTeam) {
      currentRef.current.scrollIntoView({ block: "center" });

      window.scroll(0, 0);
    }
  }, [currentTeam]);

  if (!standingsData || !currentTeam) return <CardPlaceholder />;

  return (
    <div className="team-standing">
      <Table celled={true} size="small">
        <Table.Header className="header">
          <Table.Row>
            {config.tableHeader.map((text, i) => (
              <Table.HeaderCell key={i}>{text}</Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {standingsData.map((team, i) => (
            <Ref key={i} innerRef={team === currentTeam ? currentRef : null}>
              <Table.Row className={team === currentTeam ? "current" : null}>
                <Table.Cell>{team.position}</Table.Cell>
                <Table.Cell
                  className="team-cell"
                  children={
                    <Link to={getTeamURL({ ...teams[team.team_id] })}>
                      <TeamDetail {...teams[team.team_id]} displayCode={true} />
                    </Link>
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
            </Ref>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

TeamStanding.propTypes = propTypes;

export default TeamStanding;
