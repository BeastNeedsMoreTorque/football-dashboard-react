import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import MainHeader from "../components/main-header/MainHeader";
import MainContent from "../components/main-content/MainContent";
import LeagueDetail from "../components/league-detail/LeagueDetail";

function League({ initialDataLoaded, loadNav, league, teams }) {
  const { leagueName } = useParams();

  useEffect(() => {
    if (initialDataLoaded) loadNav(leagueName);
  }, [initialDataLoaded, loadNav, leagueName]);

  return (
    <>
      <MainHeader>
        {league ? <LeagueDetail {...league} header={true} /> : null}
      </MainHeader>
      <MainContent />
    </>
  );
}

export default League;
