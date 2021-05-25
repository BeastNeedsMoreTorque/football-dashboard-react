import api from "../api/sportDataApi";
import { LEAGUE_IDS, MAX_TOP_SCORERS } from "../others/config.js";
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
      const { season_id, end_date } = league;
      const { name } = countryData[i];
      leagueData[i] = Object.assign(leagueData[i], {
        season_id,
        end_date,
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
    const teamsByName = {};
    teamsArr.forEach((team) => {
      // update arr
      team.name = formatTeamName(team.name);
      team["leagueName"] = leagueName;

      // object
      teams[team.team_id] = { ...team, leagueName };
      teamsByName[team.name] = { ...team, leagueName };
    });
    teamsArr.sort((a, b) => a.name.localeCompare(b.name));

    data[leagueName].teams = teams;
    return { teams, teamsByName, teamsArr };
  },

  async getStandings(leagueName) {
    const { league_id, season_id } = data[leagueName];
    const { standings } = await api.getStandings(league_id, season_id);

    return standings;
  },

  async getMatchResults(leagueName) {
    try {
      const leagueEnded =
        new Date(Date.now()) > new Date(data[leagueName].end_date);

      const { league_id, season_id } = data[leagueName];
      const matches = await api.getMatchResults(
        league_id,
        season_id,
        leagueEnded ? data[leagueName].end_date : new Date(Date.now())
      );

      let filtered = matches.filter(
        (match) => match.status === "finished" && match.stage.stage_id === 1
      );

      const matchesSorted = filtered
        .map((match) => {
          const { match_start_iso } = match;
          match.match_start = getLocalDate(match_start_iso);
          return match;
        })
        .sort((a, b) => new Date(a.match_start) - new Date(b.match_start));

      return matchesSorted;
    } catch (err) {
      switch (err) {
        case 403:
          return [];
        default:
          console.error(err);
          return [];
      }
    }
  },

  async getMatchUpcoming(leagueName) {
    try {
      const leagueEnded =
        new Date(Date.now()) > new Date(data[leagueName].end_date);
      if (leagueEnded) return [];

      const { league_id, season_id } = data[leagueName];
      const matches = await api.getMatchUpcoming(league_id, season_id);

      let filtered = matches.filter(
        (match) =>
          (match.status === "notstarted" || match.status === "") &&
          match.stage.state_id === 1
      );

      const matchesSorted = filtered
        .map((match) => {
          const { match_start_iso } = match;
          match.match_start = getLocalDate(match_start_iso);
          return match;
        })
        .sort((a, b) => new Date(a.match_start) - new Date(b.match_start));

      return matchesSorted;
    } catch (err) {
      switch (err) {
        case 403:
          return [];
        default:
          console.error(err);
          return [];
      }
    }
  },

  async getTopScorers(leagueName) {
    const { league_id, season_id } = data[leagueName];
    const topScorers = await api.getTopScorers(league_id, season_id);

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
