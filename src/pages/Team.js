import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { useLeague, useTeams } from "../model/selectors";

import MainHeader from "../components/UI/MainHeader";
import MainContent from "../components/UI/MainContent";
import TeamDetail from "../components/team-detail/TeamDetail";
import CardTemplate from "../components/cards/CardTemplate";
import { Grid, Loader } from "semantic-ui-react";

import { getNames } from "../others/helper";

const propTypes = {
  initialDataLoaded: PropTypes.bool.isRequired,
  loadTeams: PropTypes.func.isRequired,
};

function Team({ initialDataLoaded, loadTeams }) {
  const { leagueName, teamName } = getNames(useParams());
  const league = useLeague(leagueName);
  const { teamsByName: teams } = useTeams(leagueName);

  useEffect(() => {
    if (initialDataLoaded) loadTeams(leagueName);
  }, [initialDataLoaded, leagueName, loadTeams]);

  if (!league || !teams) return <Loader size="large" active={true} />;

  return (
    <>
      <MainHeader>
        <TeamDetail {...teams[teamName]} header={true} />
      </MainHeader>
      <MainContent>
        {/* <Grid>
          <CardTemplate
            type="teamStandings"
            teams={teams}
            teamsByName={teamsByName}
          />
          <CardTemplate type="teamSchedule" teams={teamsByName} />
          <CardTemplate type="teamForm" teams={teamsByName} />
        </Grid> */}
      </MainContent>
    </>
  );
}

Team.propTypes = propTypes;

export default Team;
