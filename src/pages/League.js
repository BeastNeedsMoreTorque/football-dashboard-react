import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import MainHeader from "../components/UI/MainHeader";
import MainContent from "../components/UI/MainContent";
import LeagueDetail from "../components/league-detail/LeagueDetail";
import CardTemplate from "../components/cards/CardTemplate";
import { Grid, Loader } from "semantic-ui-react";

function League({ initialDataLoaded, loadNav, league, teams, teamsByName }) {
  const { leagueName } = useParams();

  useEffect(() => {
    if (initialDataLoaded) loadNav(leagueName);
  }, [initialDataLoaded, loadNav, leagueName]);

  if (!teams) return <Loader size="large" />;

  return (
    <>
      <MainHeader>
        {league ? <LeagueDetail {...league} header={true} /> : null}
      </MainHeader>
      <MainContent>
        <Grid>
          <CardTemplate type="standings" teams={teams} />
          <CardTemplate type="matchResult" teams={teamsByName} />
          <CardTemplate type="matchUpcoming" teams={teamsByName} />
          <CardTemplate type="topScorers" teams={teamsByName} />
        </Grid>
      </MainContent>
    </>
  );
}

export default League;
