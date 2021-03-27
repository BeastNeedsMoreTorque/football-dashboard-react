import React from "react";
import PropTypes from "prop-types";
import { Grid } from "semantic-ui-react";
import ContentCard from "./content-card/ContentCard";

const propTypes = {
  contentData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function ContentGrid({ contentData }) {
  return (
    <Grid columns={2}>
      {contentData.map(({ type, subType, data }, i) => (
        <ContentCard key={i} type={type} subType={subType} data={data} />
      ))}
    </Grid>
  );
}

ContentGrid.propTypes = propTypes;

export default ContentGrid;
