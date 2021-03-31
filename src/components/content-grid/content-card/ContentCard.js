import React from "react";
import PropTypes from "prop-types";
import { Grid, Card, Placeholder } from "semantic-ui-react";
import StandingsDetail from "./content-detail/StandingsDetail";
import MatchesDetail from "./content-detail/MatchesDetail";
import TopScorersDetail from "./content-detail/TopScorersDetail";
import TeamStandingDetail from "./content-detail/TeamStandingDetail";
import TeamNextMatchDetail from "./content-detail/TeamNextMatchDetail";
import TeamFormDetail from "./content-detail/TeamFormDetail";

const propTypes = {
  type: PropTypes.string.isRequired,
  subType: PropTypes.string,
  data: PropTypes.object,
  onClickTeam: PropTypes.func.isRequired,
};
const defaultProps = { subType: "" };

const cardConfig = {
  standings: {
    width: 16,
    title: "Standings",
    dummyLength: 15,
    Detail: StandingsDetail,
  },
  matches: {
    width: 8,
    title: "Match",
    dummyLength: 10,
    Detail: MatchesDetail,
  },
  topScorers: {
    width: 16,
    title: "Top Scorers",
    dummyLength: 10,
    Detail: TopScorersDetail,
  },
  teamStanding: {
    width: 8,
    title: "Standings",
    dummyLength: 10,
    Detail: TeamStandingDetail,
  },
  teamNextMatch: {
    width: 8,
    title: "Upcoming",
    dummyLength: 10,
    Detail: TeamNextMatchDetail,
  },
  teamForm: {
    width: 16,
    title: "Form",
    dummyLength: 15,
    Detail: TeamFormDetail,
  },
};

function ContentCard({ type, subType, data, onClickTeam }) {
  const { width, title, dummyLength, Detail } = cardConfig[type];

  return (
    <Grid.Column width={width}>
      <Card fluid={true}>
        <Card.Content>
          <Card.Header>{`${title} ${subType}`.trim()}</Card.Header>
          {data ? (
            <Card.Description
              onClick={(e) => {
                if (!e.target.closest(".team-cell")) return;
                const { leagueId, teamId, teamCode } = e.target
                  .closest(".team-cell")
                  .querySelector(".team-detail").dataset;

                onClickTeam({ leagueId, teamId, teamCode });
              }}
              style={{
                maxHeight: `${width === 16 ? "350px" : "300px"}`,
                marginTop: "1.5rem",
                overflowY: "auto",
              }}
            >
              <Detail subType={subType} data={data} />
            </Card.Description>
          ) : (
            <Placeholder fluid={true}>
              {Array.from({ length: dummyLength }, (_, i) => (
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
ContentCard.defaultProps = defaultProps;

export default ContentCard;
