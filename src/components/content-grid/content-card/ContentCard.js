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
  editMode: PropTypes.bool.isRequired,
  selected: PropTypes.object.isRequired,
  metaData: PropTypes.object.isRequired,
  customData: PropTypes.object.isRequired,
  currentPage: PropTypes.string.isRequired,
  headerData: PropTypes.object,
  data: PropTypes.object,
  onLeagueClick: PropTypes.func.isRequired,
  onTeamClick: PropTypes.func.isRequired,
  onSelectCard: PropTypes.func.isRequired,
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
  editMode,
  selected,
  metaData,
  customData,
  currentPage,
  data,
  headerData,
  onLeagueClick,
  onTeamClick,
  onSelectCard,
}) {
  const { type, subType, leagueId, seasonId, teamId } = metaData;
  const { width, title, Detail } = subType
    ? cardConfig[type][subType]
    : cardConfig[type];

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
    const key = generateKey(metaData);
    const checked = customData.has(key);

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
              onSelectCard(metaData);
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
          {editMode ? (
            <Checkbox
              checked={selected.has(generateKey(metaData))}
              style={{
                marginBottom: "1rem",
                float: "right",
              }}
              onChange={(e) => {
                e.preventDefault();
                onSelectCard(metaData);
              }}
            />
          ) : null}
          <div
            style={editMode ? { opacity: "0.7", pointerEvents: "none" } : {}}
          >
            <Card.Header style={{ display: "flex" }}>
              <h3 style={{ display: "inline-block", margin: "0" }}>{title}</h3>
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
                  marginTop: "1rem",
                  height: "300px",
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
          </div>
        </Card.Content>
      </Card>
    </Grid.Column>
  );
}

ContentCard.propTypes = propTypes;

export default ContentCard;
