import React from "react";
import PropTypes from "prop-types";

import { Card, Grid, Popup, Checkbox } from "semantic-ui-react";
import TeamDetail from "../team-detail/TeamDetail";
import LeagueDetail from "../league-detail/LeagueDetail";

// League
import Standings from "./Standings";
import Matches from "./Matches";
import TopScorers from "./TopScorers";

// Team
import TeamStandings from "./TeamStandings";
import TeamSchedule from "./TeamSchedule";
import TeamForm from "./TeamForm";
import { getCardKey, getTeamURL } from "../../others/helper";
import { useLeague, useTeams } from "../../model/selectors";
import { Link } from "react-router-dom";

const propTypes = {
  type: PropTypes.string.isRequired,
  currentLeague: PropTypes.string.isRequired,
  currentTeam: PropTypes.string,
  customs: PropTypes.array,
  onCardSelect: PropTypes.func,
  editMode: PropTypes.bool,
  selected: PropTypes.array,
};

const defaultProps = { editMode: false };

export const style = {
  card: { minHeight: "300px" },
  cardHeader: { display: "flex" },
  headerDetail: {
    marginLeft: "auto",
    marginRight: "1rem",
    fontWeight: "600",
    fontSize: "1rem",
  },
  editModeCheckbox: {
    float: "right",
    marginLeft: "1rem",
  },
  toggleButton: { marginLeft: "auto" },
  cardDescription: {
    marginTop: "1.2rem",
    overflowY: "hidden",
  },
  editModeSelected: {
    opacity: "1 !important",
  },
};

const cardConfig = {
  standings: {
    width: 16,
    title: "Standings",
    Content: Standings,
  },
  matchResult: {
    width: 8,
    title: "Results",
    subType: "result",
    Content: Matches,
  },
  matchUpcoming: {
    width: 8,
    title: "Upcoming",
    subType: "upcoming",
    Content: Matches,
  },
  topScorers: {
    width: 16,
    title: "Top Scorers",
    Content: TopScorers,
  },
  teamStandings: {
    width: 8,
    title: "Standings",
    Content: TeamStandings,
  },
  teamSchedule: {
    width: 8,
    title: "Upcoming",
    Content: TeamSchedule,
  },
  teamForm: {
    width: 16,
    title: "Form",
    Content: TeamForm,
  },
};

function CardTemplate({
  type,
  currentLeague,
  currentTeam,
  customs,
  onCardSelect,
  editMode,
  selected,
}) {
  const { width, title, subType, Content } = cardConfig[type];
  const league = useLeague(currentLeague);
  const { teamsByName: teams } = useTeams(currentLeague);
  const cardKey = getCardKey({ type, currentLeague, currentTeam });
  const isChecked = customs?.includes(cardKey);
  const isSelected = selected?.includes(cardKey);

  if (!teams) return null;

  const addToCustomButton = (
    <Popup
      content={isChecked ? "Remove from custom page" : "Add to custom page"}
      size="small"
      trigger={
        <Checkbox
          checked={isChecked}
          style={style.toggleButton}
          toggle={true}
          onClick={(e) => {
            e.preventDefault();
            onCardSelect(cardKey);
          }}
        />
      }
    />
  );

  const editModeCheckbox = (
    <Checkbox
      checked={isSelected}
      style={style.editModeCheckbox}
      onChange={(e) => {
        e.preventDefault();
        onCardSelect(cardKey);
      }}
    />
  );

  const detail = (
    <div style={style.headerDetail}>
      {currentTeam ? (
        <Link to={getTeamURL({ ...teams[currentTeam] })}>
          <TeamDetail {...teams[currentTeam]} />
        </Link>
      ) : (
        <Link to={`/league/${currentLeague.replaceAll(" ", "-")}`}>
          <LeagueDetail {...league} />
        </Link>
      )}
    </div>
  );

  return (
    <Grid.Column width={width}>
      <Card as="article" fluid={true} style={style.card}>
        <Card.Content>
          {!customs && editMode ? editModeCheckbox : null}
          <Card.Header style={style.cardHeader}>
            <h3>{title}</h3>
            {customs ? addToCustomButton : detail}
          </Card.Header>
          <Card.Description style={style.cardDescription}>
            <Content
              subType={subType}
              currentLeague={currentLeague}
              currentTeam={currentTeam}
            />
          </Card.Description>
        </Card.Content>
      </Card>
    </Grid.Column>
  );
}

CardTemplate.propTypes = propTypes;
CardTemplate.defaultProps = defaultProps;

export default CardTemplate;
