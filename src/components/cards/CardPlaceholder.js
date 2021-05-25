import React from "react";
import { Placeholder } from "semantic-ui-react";

function CardPlaceholder() {
  return (
    <Placeholder fluid={true}>
      {Array.from({ length: 12 }, (_, i) => (
        <Placeholder.Line key={i} />
      ))}
    </Placeholder>
  );
}

export default CardPlaceholder;
