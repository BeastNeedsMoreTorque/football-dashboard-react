import React from "react";
import PropTypes from "prop-types";
import { Grid } from "semantic-ui-react";
import ContentCard from "./content-card/ContentCard";

const propTypes = {
  contentData: PropTypes.arrayOf(PropTypes.object).isRequired,
  customData: PropTypes.object.isRequired,
  onTeamClick: PropTypes.func.isRequired,
  onCardToggleChange: PropTypes.func.isRequired,
};

function ContentGrid({
  contentData,
  customData,
  onTeamClick,
  onCardToggleChange,
}) {
  return (
    <Grid>
      {contentData.map(({ data, ...metaData }, i) => (
        <ContentCard
          key={i}
          customData={customData}
          metaData={metaData}
          data={data}
          onTeamClick={onTeamClick}
          onCardToggleChange={onCardToggleChange}
        />
      ))}
    </Grid>
  );
}

ContentGrid.propTypes = propTypes;

export default ContentGrid;
