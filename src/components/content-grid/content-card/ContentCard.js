import React from "react";
import PropTypes from "prop-types";
import { Grid, Card, Placeholder, Checkbox } from "semantic-ui-react";
import StandingsDetail from "./content-detail/StandingsDetail";
import MatchesDetail from "./content-detail/MatchesDetail";
import TopScorersDetail from "./content-detail/TopScorersDetail";
import TeamStandingDetail from "./content-detail/TeamStandingDetail";
import TeamNextMatchDetail from "./content-detail/TeamNextMatchDetail";
import TeamFormDetail from "./content-detail/TeamFormDetail";
import { generateKey } from "../../../others/helper";

const propTypes = {
  customData: PropTypes.object.isRequired,
  metaData: PropTypes.object.isRequired,
  data: PropTypes.object,
  onTeamClick: PropTypes.func.isRequired,
  onCardToggleChange: PropTypes.func.isRequired,
};

const cardConfig = {
  standings: {
    width: 16,
    title: "Standings",
    Detail: StandingsDetail,
  },
  matches: {
    result: {
      width: 8,
      title: "Match Results",
      Detail: MatchesDetail,
    },
    upcoming: {
      width: 8,
      title: "Match Upcoming",
      Detail: MatchesDetail,
    },
  },
  topScorers: {
    width: 16,
    title: "Top Scorers",
    Detail: TopScorersDetail,
  },
  teamStanding: {
    width: 8,
    title: "Standings",
    Detail: TeamStandingDetail,
  },
  teamNextMatch: {
    width: 8,
    title: "Upcoming",
    Detail: TeamNextMatchDetail,
  },
  teamForm: {
    width: 16,
    title: "Form",
    Detail: TeamFormDetail,
  },
};

function ContentCard({
  customData,
  metaData,
  data,
  onTeamClick,
  onCardToggleChange,
}) {
  const { type, subType, leagueId, seasonId } = metaData;
  const { width, title, Detail } = subType
    ? cardConfig[type][subType]
    : cardConfig[type];
  const key = generateKey(metaData);

  const checked = customData.has(key);

  return (
    <Grid.Column width={width}>
      <Card fluid={true}>
        <Card.Content>
          <Card.Header style={{ display: "flex" }}>
            <h3 style={{ display: "inline-block" }}>{title}</h3>
            <Checkbox
              checked={checked}
              style={{ marginLeft: "auto" }}
              toggle={true}
              onChange={(e) => {
                e.preventDefault();
                onCardToggleChange(metaData);
              }}
            />
          </Card.Header>
          {data ? (
            <Card.Description
              onClick={(e) => {
                if (!e.target.closest(".team-cell")) return;
                const { teamId, teamCode } = e.target
                  .closest(".team-cell")
                  .querySelector(".team-detail").dataset;

                onTeamClick({ leagueId, seasonId, teamId, teamCode });
              }}
              style={{
                maxHeight: `${width === 16 ? "350px" : "300px"}`,
                overflowY: "auto",
              }}
            >
              <Detail subType={subType} data={data} />
            </Card.Description>
          ) : (
            <Placeholder fluid={true}>
              {Array.from({ length: 15 }, (_, i) => (
                <Placeholder.Line key={i} />
              ))}
            </Placeholder>
          )}
        </Card.Content>
      </Card>
    </Grid.Column>
  );
}

ContentCard.propTypes = propTypes;

export default ContentCard;
