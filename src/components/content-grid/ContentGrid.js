import React from "react";
import PropTypes from "prop-types";
import { Grid } from "semantic-ui-react";
import ContentCard from "./content-card/ContentCard";

const propTypes = {
  editMode: PropTypes.bool.isRequired,
  selected: PropTypes.object.isRequired,
  contentData: PropTypes.arrayOf(PropTypes.object).isRequired,
  customData: PropTypes.object.isRequired,
  currentPage: PropTypes.string.isRequired,
  onLeagueClick: PropTypes.func.isRequired,
  onTeamClick: PropTypes.func.isRequired,
  onSelectCard: PropTypes.func.isRequired,
};

function ContentGrid({
  editMode,
  selected,
  contentData,
  customData,
  currentPage,
  onLeagueClick,
  onTeamClick,
  onSelectCard,
}) {
  return (
    <Grid>
      {contentData.map(({ data, headerData, ...metaData }, i) => (
        <ContentCard
          key={i}
          editMode={editMode}
          selected={selected}
          metaData={metaData}
          customData={customData}
          currentPage={currentPage}
          data={data}
          headerData={headerData}
          onLeagueClick={onLeagueClick}
          onTeamClick={onTeamClick}
          onSelectCard={onSelectCard}
        />
      ))}
    </Grid>
  );
}

ContentGrid.propTypes = propTypes;

export default ContentGrid;
