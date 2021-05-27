import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { getNames } from "../others/helper";

import { useLeague } from "../model/selectors";

import MainHeader from "../components/UI/MainHeader";
import MainContent from "../components/UI/MainContent";
import LeagueDetail from "../components/league-detail/LeagueDetail";
import CardTemplate from "../components/cards/CardTemplate";
import { Grid, Loader } from "semantic-ui-react";

const propTypes = {
  initialDataLoaded: PropTypes.bool.isRequired,
  loadTeams: PropTypes.func.isRequired,
};

function League({ initialDataLoaded, loadTeams }) {
  const { leagueName } = getNames(useParams());
  const league = useLeague(leagueName);

  useEffect(() => {
    if (initialDataLoaded) loadTeams(leagueName);
  }, [initialDataLoaded, leagueName, loadTeams]);

  if (!league) return <Loader size="large" active={true} />;

  return (
    <>
      <MainHeader>
        <LeagueDetail
          name={league.name}
          countryName={league.countryName}
          header={true}
        />
      </MainHeader>
      <MainContent>
        <Grid>
          <CardTemplate
            key={`${league.league_id}-standings`}
            type="standings"
            currentLeague={leagueName}
          />
          <CardTemplate
            key={`${league.league_id}-result`}
            type="matchResult"
            currentLeague={leagueName}
          />
          <CardTemplate
            key={`${league.league_id}-upcoming`}
            type="matchUpcoming"
            currentLeague={leagueName}
          />
          {/* <CardTemplate key={`${league.league_id}-top`} type="topScorers" currentLeague={leagueName} /> */}
        </Grid>
      </MainContent>
    </>
  );
}

League.propTypes = propTypes;

export default League;
