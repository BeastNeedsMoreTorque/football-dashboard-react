import { store } from "./model";

export const useLeagues = function () {
  return Object.values(store);
};

export const useLeague = function (leagueName) {
  if (!leagueName || !store[leagueName]) return null;

  return store[leagueName];
};

export const useTeams = function (leagueName) {
  if (!leagueName || !store[leagueName])
    return { teams: null, teamsByName: null, teamsArr: null };

  const teams = store[leagueName].teams;
  const teamsByName = store[leagueName].teamsByName;
  const teamsArr = store[leagueName].teamsArr;

  return { teams, teamsByName, teamsArr };
};

export const useStandings = function (leagueName) {
  if (!leagueName || !store[leagueName]) return null;

  return store[leagueName].standings;
};

export const useMatchStatus = function (leagueName) {
  if (!leagueName || !store[leagueName]) return null;

  const result = store[leagueName].matchResultStatus;
  const upcoming = store[leagueName].matchUpcomingStatus;

  return { result, upcoming };
};

export const useMatches = function (leagueName) {
  if (!leagueName || !store[leagueName]) return null;

  const result = store[leagueName].matchResults;
  const upcoming = store[leagueName].matchUpcoming;

  return { result, upcoming };
};

export const useScorersStatus = function (leagueName) {
  if (!leagueName || !store[leagueName]) return null;

  return store[leagueName].topScorersStatus;
};

export const useScorers = function (leagueName) {
  if (!leagueName || !store[leagueName]) return null;

  return store[leagueName].topScorers;
};
