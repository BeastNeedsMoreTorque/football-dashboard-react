import React from "react";
import { Card, Grid } from "semantic-ui-react";
import MainContent from "../components/main-content/MainContent";
import MainHeader from "../components/main-header/MainHeader";

import { style } from "../components/content-grid/content-card/ContentCard";

const listStyles = {
  ul: {
    marginTop: "1rem",
    paddingInlineStart: "1rem",
    listStyle: "none",
    color: "#333",
    fontSize: "1.1rem",
  },
  li: { marginBottom: "1rem" },
};

const howToTexts = [
  "1. Navigate through League and Team tabs.",
  "2. Create your own dashboard by adding contents.",
  "3. Check it out on Custom tab and edit.",
  "4. Have fun 🙂",
];

function Home() {
  return (
    <>
      <MainHeader>
        <h2>Welcome !</h2>
      </MainHeader>
      <MainContent>
        <Grid>
          <Grid.Column width={16}>
            <Card fluid={true} style={style.card}>
              <Card.Content>
                <Card.Header style={style.cardHeader}>
                  <h3>{"How To Use"}</h3>
                </Card.Header>
                <Card.Description style={style.cardDescription}>
                  <ul style={listStyles.ul}>
                    {howToTexts.map((text, i) => (
                      <li style={listStyles.li} key={i}>
                        {text}
                      </li>
                    ))}
                  </ul>
                </Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>
      </MainContent>
    </>
  );
}

export default Home;
