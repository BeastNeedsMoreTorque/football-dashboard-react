import React from "react";
import PropTypes from "prop-types";
import { Grid } from "semantic-ui-react";
import ContentCard from "./content-card/ContentCard";

const propTypes = {
  contentData: PropTypes.arrayOf(PropTypes.object).isRequired,
  customData: PropTypes.object.isRequired,
  currentPage: PropTypes.string.isRequired,
  onLeagueClick: PropTypes.func.isRequired,
  onTeamClick: PropTypes.func.isRequired,
  onCardToggleChange: PropTypes.func.isRequired,
};

function ContentGrid({
  contentData,
  customData,
  currentPage,
  onLeagueClick,
  onTeamClick,
  onCardToggleChange,
}) {
  return (
    <Grid>
      {contentData.map(({ data, headerData, ...metaData }, i) => (
        <ContentCard
          key={i}
          metaData={metaData}
          customData={customData}
          currentPage={currentPage}
          data={data}
          headerData={headerData}
          onLeagueClick={onLeagueClick}
          onTeamClick={onTeamClick}
          onCardToggleChange={onCardToggleChange}
        />
      ))}
    </Grid>
  );
}

ContentGrid.propTypes = propTypes;

export default ContentGrid;
