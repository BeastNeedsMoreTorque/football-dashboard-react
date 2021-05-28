import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { useTeams, useStandings } from "../../model/selectors";
import { getTeamURL } from "../../others/helper";

import { Ref, Table } from "semantic-ui-react";
import TeamDetail from "../team-detail/TeamDetail";
import CardPlaceholder from "./CardPlaceholder";

const propTypes = {
  currentLeague: PropTypes.string.isRequired,
  currentTeam: PropTypes.string.isRequired,
};

// prettier-ignore
const config = { tableHeader: ["#", "Team", "Points", "Diff", "Played", "W", "D", "L"] };

function TeamStanding({ currentLeague, currentTeam: currentTeamName }) {
  const standings = useStandings(currentLeague);
  const { teams, teamsByName } = useTeams(currentLeague);

  const currentTeam = standings?.find(
    (team) => team.team_id === teamsByName[currentTeamName].team_id
  );
  const currentRef = useRef(null);

  useEffect(() => {
    if (currentTeam) {
      currentRef.current.scrollIntoView({ block: "center" });

      window.scroll(0, 0);
    }
  }, [currentTeam]);

  if (!standings || !currentTeam) return <CardPlaceholder />;

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
          {standings.map((team, i) => (
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
