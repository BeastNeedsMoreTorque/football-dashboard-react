import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { getNames } from "../others/helper";

import { useLeague, useTeams } from "../model/selectors";

import MainHeader from "../components/UI/MainHeader";
import MainContent from "../components/UI/MainContent";
import TeamDetail from "../components/team-detail/TeamDetail";
import CardTemplate from "../components/cards/CardTemplate";
import { Grid, Loader } from "semantic-ui-react";

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

  const currentTeam = teams[teamName];

  return (
    <>
      <MainHeader>
        <TeamDetail {...currentTeam} header={true} />
      </MainHeader>
      <MainContent>
        <Grid>
          <CardTemplate
            key={`${currentTeam.team_id}-teamStandings`}
            type="teamStandings"
            currentLeague={leagueName}
            currentTeam={teamName}
          />
          <CardTemplate
            key={`${currentTeam.team_id}-schedule`}
            type="teamSchedule"
            currentLeague={leagueName}
            currentTeam={teamName}
          />
          <CardTemplate
            key={`${currentTeam.team_id}-form`}
            type="teamForm"
            currentLeague={leagueName}
            currentTeam={teamName}
          />
        </Grid>
      </MainContent>
    </>
  );
}

Team.propTypes = propTypes;

export default Team;
