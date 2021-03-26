import api from "../api/sportDataApi";
import {
  LEAGUE_IDS,
  MAX_TOP_SCORERS,
  MAX_FORM_RESULTS,
} from "../others/config.js";
import { getLocalDate, formatTeamName } from "../others/helper.js";

export const model = {
  async getLeagueData() {
    const leagueData = await Promise.all(
      LEAGUE_IDS.map((leagueId) => api.getLeague(leagueId))
    );

    const countryData = await Promise.all(
      leagueData.map((league) => api.getCountry(league.country_id))
    );

    const seasonsData = await Promise.all(
      leagueData.map((league) => api.getSeason(league.league_id))
    );

    const currentSeasons = seasonsData.map((leagueArr) => {
      const [current] = leagueArr.filter((season) => season.is_current);
      return current;
    });

    currentSeasons.forEach((league, i) => {
      const { season_id } = league;
      const { name } = countryData[i];
      leagueData[i] = Object.assign(leagueData[i], {
        season_id,
        countryName: name,
      });
    });

    return leagueData;
  },

  async getLeagueName(leagueId) {
    if (!LEAGUE_IDS.includes(+leagueId)) throw new Error("Invalid league ID");
    const { name: leagueName } = await api.getLeague(leagueId);

    return leagueName;
  },

  async getTeamName(leagueId, teamId) {
    if (!LEAGUE_IDS.includes(+leagueId)) throw new Error("Invalid league ID");
    const { name: teamName } = await api.getTeam(leagueId, teamId);

    return teamName;
  },

  async getStandingsData(leagueId, seasonId) {
    const seasons = await api.getSeason(leagueId);
    const [current] = seasons.filter((season) => season.is_current);
    if (current.season_id !== +seasonId) throw new Error("Invalid season ID");

    const { standings: standingsData } = await api.getStandings(
      leagueId,
      seasonId
    );

    return standingsData;
  },

  async getTeamsData(leagueId, standingsData) {
    const teamsDataArr = await Promise.all(
      standingsData.map((team) => api.getTeam(leagueId, team.team_id))
    );

    const teamsData = {};
    const teamsDataByName = {};

    teamsDataArr.forEach((team) => {
      const { team_id, name } = team;
      team.name = formatTeamName(name);
      teamsData[team_id] = team;
      teamsDataByName[name] = team;
    });

    teamsDataArr.sort((a, b) => a.name.localeCompare(b.name));

    return { teamsDataArr, teamsData, teamsDataByName };
  },

  async getMatchResultsData(
    leagueId,
    seasonId,
    isMonth = false,
    teamCode = null
  ) {
    const matchesData = await api.getMatchResults(leagueId, seasonId, isMonth);

    // filter status
    let filtered = matchesData.filter((match) => match.status === "finished");

    // filter by team
    if (teamCode) {
      filtered = filtered.filter((match) => {
        return (
          match.home_team.short_code === teamCode ||
          match.away_team.short_code === teamCode
        );
      });
    }

    // get local time & sort
    const matchesSorted = filtered
      .map((match) => {
        const { match_start_iso } = match;
        match.match_start = getLocalDate(match_start_iso);
        return match;
      })
      .sort((a, b) => new Date(a.match_start) - new Date(b.match_start));

    if (teamCode && matchesSorted.length > MAX_FORM_RESULTS) {
      matchesSorted.splice(0, matchesSorted.length - MAX_FORM_RESULTS);
    }

    return matchesSorted;
  },

  async getMatchUpcomingData(leagueId, seasonId, teamCode = null) {
    const matchesData = await api.getMatchUpcoming(leagueId, seasonId);

    // filter status
    let filtered = matchesData.filter((match) => match.status === "notstarted");

    // filter by team
    if (teamCode) {
      filtered = filtered.filter((match) => {
        return (
          match.home_team.short_code === teamCode ||
          match.away_team.short_code === teamCode
        );
      });
    }

    // get local time & sort
    const matchesSorted = filtered
      .map((match) => {
        const { match_start_iso } = match;
        match.match_start = getLocalDate(match_start_iso);
        return match;
      })
      .sort((a, b) => new Date(a.match_start) - new Date(b.match_start));

    return matchesSorted;
  },

  async getTopScorersData(leagueId, seasonId) {
    const topScorers = await api.getTopScorers(leagueId, seasonId);

    // find index
    let index = 0;
    for (const player of topScorers) {
      if (player.goals.overall < topScorers[MAX_TOP_SCORERS].goals.overall)
        break;
      index++;
    }

    return topScorers.slice(0, index);
  },
};
