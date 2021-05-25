import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import MainHeader from "../components/main-header/MainHeader";
import MainContent from "../components/main-content/MainContent";
import TeamDetail from "../components/team-detail/TeamDetail";

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
      <MainContent />
    </>
  );
}

export default Team;
