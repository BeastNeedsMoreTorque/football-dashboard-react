import "./TeamNextMatchDetail.css";
import React from "react";
import PropTypes from "prop-types";
import { Table } from "semantic-ui-react";
import TeamDetail from "../../../team-detail/TeamDetail";
import { formatDate } from "../../../../others/helper";

const propTypes = {
  data: PropTypes.object.isRequired,
  metaData: PropTypes.object.isRequired,
};

const config = {
  tableHeader: ["Schedule", "Opponent"],
};

function TeamNextMatchDetail({ data, metaData }) {
  const { matchesData, teamsDataByName } = data;
  const { seasonId, teamCode } = metaData;

  return (
    <Table
      className="team-next-match-detail"
      celled={true}
      size="small"
      textAlign="center"
    >
      <Table.Header className="header">
        <Table.Row>
          {config.tableHeader.map((text, i) => (
            <Table.HeaderCell key={i}>{text}</Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {matchesData.map((match, i) => {
          const isHome = match.home_team.short_code === teamCode;
          const opponentName = isHome
            ? match.away_team.name
            : match.home_team.name;

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
                  <TeamDetail
                    {...teamsDataByName[opponentName]}
                    seasonId={seasonId}
                    displayCode={true}
                  />
                }
              />
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}

TeamNextMatchDetail.propTypes = propTypes;

export default TeamNextMatchDetail;
