import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import MainHeader from "../components/UI/MainHeader";
import MainContent from "../components/UI/MainContent";
import TeamDetail from "../components/team-detail/TeamDetail";
import CardTemplate from "../components/cards/CardTemplate";
import { Grid, Loader } from "semantic-ui-react";

function Team({ initialDataLoaded, loadNav, teams, teamsByName }) {
  const { leagueName, teamName } = useParams();

  useEffect(() => {
    if (initialDataLoaded) loadNav(leagueName);
  }, [initialDataLoaded, loadNav, leagueName]);

  if (!teams) return <Loader size="large" />;

  return (
    <>
      <MainHeader>
        {teams ? (
          <TeamDetail
            {...teamsByName[teamName.replaceAll("-", " ")]}
            header={true}
          />
        ) : null}
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
