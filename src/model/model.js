import api from "../api/sportDataApi";
import {
  LEAGUE_IDS,
  MAX_TOP_SCORERS,
  MAX_FORM_RESULTS,
} from "../others/config.js";
import { getLocalDate, formatTeamName } from "../others/helper.js";

const data = {};

export const model = {
  async getLeagues() {
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

      data[leagueData[i].name] = leagueData[i];
    });

    return leagueData;
  },

  getLeague(leagueName) {
    return data[leagueName];
  },

  async getTeams(leagueName) {
    if (!data[leagueName]) throw new Error("Invalid league name");

    const standings = await this.getStandings(leagueName);
    const teamsArr = await Promise.all(
      standings.map(({ team_id }) =>
        api.getTeam(data[leagueName].league_id, team_id)
      )
    );

    const teams = {};
    teamsArr.forEach((team) => {
      // update arr
      team.name = formatTeamName(team.name);
      team["leagueName"] = leagueName;

      // object
      teams[team.name] = { ...team, leagueName };
    });
    teamsArr.sort((a, b) => a.name.localeCompare(b.name));

    data[leagueName].teams = teams;
    return { teams, teamsArr };
  },

  async getStandings(leagueName) {
    const { league_id, season_id } = data[leagueName];

    const { standings } = await api.getStandings(league_id, season_id);

    return standings;
  },

  async getMatchResultsData({ leagueId, seasonId, teamCode }) {
    const isMonth = teamCode ? true : false;
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

  async getMatchUpcomingData({ leagueId, seasonId, teamCode }) {
    const isMonth = teamCode ? true : false;
    const matchesData = await api.getMatchUpcoming(leagueId, seasonId, isMonth);

    // filter status
    let filtered = matchesData.filter(
      (match) => match.status === "notstarted" || match.status === ""
    );

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
      if (player.goals.overall < topScorers[MAX_TOP_SCORERS - 1].goals.overall)
        break;
      index++;
    }

    return topScorers.slice(0, index);
  },
};
