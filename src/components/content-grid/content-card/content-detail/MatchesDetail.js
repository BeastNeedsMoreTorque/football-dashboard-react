import "./MatchesDetail.css";
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Table } from "semantic-ui-react";
import TeamDetail from "../../../team-detail/TeamDetail";
import DatePicker from "./DatePicker";

const propTypes = {
  data: PropTypes.object.isRequired,
  subType: PropTypes.string.isRequired,
};

const config = {
  Result: { tableHeader: ["Home", "Result", "Away"] },
  Upcoming: { tableHeader: ["Home", "Schedule", "Away"] },
};

const getUniqueDates = function (dateArr) {
  return Array.from(new Set(dateArr.map((date) => date.slice(0, 10))));
};

function MatchesDetail({ data, subType }) {
  const { matchesData, teamsDataByName } = data;
  const uniqueDates = getUniqueDates(
    matchesData.map((match) => match.match_start)
  );
  if (subType === "Result") uniqueDates.reverse();
  const [date, setDate] = useState(uniqueDates[0]);

  return (
    <>
      <DatePicker dateArr={uniqueDates} onChange={setDate} />
      <Table
        className="matches-detail"
        celled={true}
        size="small"
        textAlign="center"
      >
        <Table.Header className="header">
          <Table.Row>
            {config[subType].tableHeader.map((text, i) => (
              <Table.HeaderCell width={5} key={i}>
                {text}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {matchesData
            .filter((match) => match.match_start.slice(0, 10) === date)
            .map((match, i) => {
              const homeTeam = teamsDataByName[match.home_team.name];
              const awayTeam = teamsDataByName[match.away_team.name];
              const homeScore = match.stats.home_score;
              const awayScore = match.stats.away_score;

              return (
                <Table.Row key={i}>
                  <Table.Cell
                    className={`team-cell home ${
                      homeScore > awayScore ? "winner" : ""
                    }`}
                    children={<TeamDetail {...homeTeam} displayCode={true} />}
                  />
                  {subType === "Result" ? (
                    <Table.Cell
                      className={`score ${
                        homeScore === awayScore ? "winner" : ""
                      }`}
                    >
                      {homeScore} - {awayScore}
                    </Table.Cell>
                  ) : (
                    <Table.Cell width={6} className="schedule">
                      {match.match_start.split(" ")[1]}
                      <br />
                      <small
                        children={`@ ${match.venue?.name || "TBD"}`}
                        style={{ fontSize: "90%" }}
                      />
                    </Table.Cell>
                  )}

                  <Table.Cell
                    className={`team-cell home ${
                      awayScore > homeScore ? "winner" : ""
                    }`}
                    children={<TeamDetail {...awayTeam} displayCode={true} />}
                  />
                </Table.Row>
              );
            })}
        </Table.Body>
      </Table>
    </>
  );
}

MatchesDetail.propTypes = propTypes;

export default MatchesDetail;
