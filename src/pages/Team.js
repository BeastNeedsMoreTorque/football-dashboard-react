import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import MainHeader from "../components/UI/MainHeader";
import MainContent from "../components/UI/MainContent";
import TeamDetail from "../components/team-detail/TeamDetail";
import CardTemplate from "../components/cards/CardTemplate";
import { Grid } from "semantic-ui-react";

function Team({ initialDataLoaded, loadNav, teams }) {
  const { leagueName, teamName } = useParams();

  useEffect(() => {
    if (initialDataLoaded) loadNav(leagueName);
  }, [initialDataLoaded, loadNav, leagueName]);

  return (
    <>
      <MainHeader>
        {teams ? <TeamDetail {...teams[teamName]} header={true} /> : null}
      </MainHeader>
      <MainContent>
        <Grid>
          <CardTemplate type="teamStandings" teams={teams} />
          <CardTemplate type="teamSchedule" teams={teams} />
          <CardTemplate type="teamForm" teams={teams} />
        </Grid>
      </MainContent>
    </>
  );
}

export default Team;
