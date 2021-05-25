import React from "react";
import PropTypes from "prop-types";

import { Card, Grid } from "semantic-ui-react";

// League
import Standings from "./Standings";
import Matches from "./Matches";
import TopScorers from "./TopScorers";

// Team
import TeamStandings from "./TeamStandings";
import TeamSchedule from "./TeamSchedule";
import TeamForm from "./TeamForm";

const propTypes = {
  type: PropTypes.string.isRequired,
  teams: PropTypes.object,
};

export const style = {
  card: { minHeight: "300px" },
  cardHeader: { display: "flex" },
  headerDetail: {
    marginLeft: "auto",
    marginRight: "1rem",
    fontWeight: "600",
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
  editMode: {
    opacity: "0.5",
    pointerEvents: "none",
  },
  editModeSelected: {
    opacity: "1",
    pointerEvents: "none",
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

function CardTemplate({ type, teams, teamsByName }) {
  const { width, title, subType, Content } = cardConfig[type];

  return (
    <Grid.Column width={width}>
      <Card fluid={true} style={style.card}>
        <Card.Content>
          <Card.Header style={style.cardHeader}>
            <h3>{title}</h3>
          </Card.Header>
          <Card.Description style={style.cardDescription}>
            <Content
              subType={subType}
              teams={teams}
              teamsByName={teamsByName}
            />
          </Card.Description>
        </Card.Content>
      </Card>
    </Grid.Column>
  );
}

CardTemplate.propTypes = propTypes;

export default CardTemplate;
