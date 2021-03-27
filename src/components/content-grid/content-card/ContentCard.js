import React from "react";
import PropTypes from "prop-types";
import { Grid, Card, Placeholder } from "semantic-ui-react";
import StandingsDetail from "./content-detail/StandingsDetail";
import MatchesDetail from "./content-detail/MatchesDetail";
import TopScorersDetail from "./content-detail/TopScorersDetail";

const propTypes = {
  type: PropTypes.string.isRequired,
  subType: PropTypes.string,
  data: PropTypes.object,
};
const defaultProps = { subType: "" };

const cardConfig = {
  standings: {
    style: { width: "100%" },
    title: "Standings",
    dummyLength: 15,
    Detail: StandingsDetail,
  },
  matches: {
    title: "Match",
    dummyLength: 10,
    Detail: MatchesDetail,
  },
  topScorers: {
    style: { width: "100%" },
    title: "Top Scorers",
    dummyLength: 10,
    Detail: TopScorersDetail,
  },
};

function ContentCard({ type, subType, data }) {
  const { style, title, dummyLength, Detail } = cardConfig[type];

  return (
    <Grid.Column style={style}>
      <Card fluid={true}>
        <Card.Content>
          <Card.Header>{`${title} ${subType}`.trim()}</Card.Header>
          {data ? (
            <Card.Description
              style={{
                maxHeight: "350px",
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
