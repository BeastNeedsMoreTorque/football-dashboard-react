import React from "react";
import PropTypes from "prop-types";
import { Grid } from "semantic-ui-react";
import ContentCard from "./content-card/ContentCard";

const propTypes = {
  contentData: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClickTeam: PropTypes.func.isRequired,
};

function ContentGrid({ contentData, onClickTeam }) {
  return (
    <Grid>
      {contentData.map(({ type, subType, data }, i) => (
        <ContentCard
          key={i}
          type={type}
          subType={subType}
          data={data}
          onClickTeam={onClickTeam}
        />
      ))}
    </Grid>
  );
}

ContentGrid.propTypes = propTypes;

export default ContentGrid;
