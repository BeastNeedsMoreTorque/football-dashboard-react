import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import MainHeader from "../components/UI/MainHeader";
import MainContent from "../components/UI/MainContent";
import TeamDetail from "../components/team-detail/TeamDetail";
import CardTemplate from "../components/cards/CardTemplate";
import { Grid, Loader } from "semantic-ui-react";
import { useNames } from "../hooks/useNames";

function Team({ initialDataLoaded, loadNav, teams, teamsByName }) {
  const { leagueName, teamName } = useNames(useParams());

  useEffect(() => {
    if (initialDataLoaded) loadNav(leagueName);
  }, [initialDataLoaded, loadNav, leagueName]);

  if (!teams) return <Loader size="large" active={true} />;

  return (
    <>
      <MainHeader>
        <TeamDetail {...teamsByName[teamName]} header={true} />
      </MainHeader>
      <MainContent>
        <Grid>
          <CardTemplate
            type="teamStandings"
            teams={teams}
            teamsByName={teamsByName}
          />
          <CardTemplate type="teamSchedule" teams={teamsByName} />
          <CardTemplate type="teamForm" teams={teamsByName} />
        </Grid>
      </MainContent>
    </>
  );
}

export default Team;
