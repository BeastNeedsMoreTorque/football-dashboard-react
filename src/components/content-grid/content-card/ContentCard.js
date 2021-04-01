import React from "react";
import PropTypes from "prop-types";
import { Grid, Card, Placeholder, Popup, Checkbox } from "semantic-ui-react";
import LeagueDetail from "../../league-detail/LeagueDetail";
import TeamDetail from "../../team-detail/TeamDetail";
import StandingsDetail from "./content-detail/StandingsDetail";
import MatchesDetail from "./content-detail/MatchesDetail";
import TopScorersDetail from "./content-detail/TopScorersDetail";
import TeamStandingDetail from "./content-detail/TeamStandingDetail";
import TeamNextMatchDetail from "./content-detail/TeamNextMatchDetail";
import TeamFormDetail from "./content-detail/TeamFormDetail";
import { generateKey } from "../../../others/helper";

const propTypes = {
  metaData: PropTypes.object.isRequired,
  customData: PropTypes.object.isRequired,
  currentPage: PropTypes.string.isRequired,
  headerData: PropTypes.object,
  data: PropTypes.object,
  onLeagueClick: PropTypes.func.isRequired,
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
  metaData,
  customData,
  currentPage,
  data,
  headerData,
  onLeagueClick,
  onTeamClick,
  onCardToggleChange,
}) {
  const { type, subType, leagueId, seasonId, teamId } = metaData;
  const { width, title, Detail } = subType
    ? cardConfig[type][subType]
    : cardConfig[type];
  const key = generateKey(metaData);
  const checked = customData.has(key);

  let renderHeader;

  if (currentPage === "custom") {
    if (headerData) {
      const Detail = teamId ? TeamDetail : LeagueDetail;
      const onClick = teamId ? onTeamClick : onLeagueClick;
      renderHeader = (
        <div
          className="detail"
          style={{
            marginLeft: "auto",
            marginRight: "1rem",
            color: "#666",
            cursor: "pointer",
          }}
          onClick={(e) => {
            const metaData = e.target.closest(".detail").firstChild.dataset;
            onClick(metaData);
          }}
        >
          <Detail
            {...headerData}
            size="small"
            seasonId={seasonId}
            displayCode={true}
          />
        </div>
      );
    }
    // headerData not loaded
    else renderHeader = <div />;
  }
  // other page
  else {
    renderHeader = (
      <Popup
        content={checked ? "Remove from custom page" : "Add to custom page"}
        size="small"
        trigger={
          <Checkbox
            checked={checked}
            style={{ marginLeft: "auto" }}
            toggle={true}
            onChange={(e) => {
              e.preventDefault();
              onCardToggleChange(metaData);
            }}
          />
        }
      />
    );
  }

  return (
    <Grid.Column width={width}>
      <Card fluid={true}>
        <Card.Content>
          <Card.Header style={{ display: "flex" }}>
            <h3 style={{ display: "inline-block" }}>{title}</h3>
            {renderHeader}
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
              <Detail subType={subType} data={data} metaData={metaData} />
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
