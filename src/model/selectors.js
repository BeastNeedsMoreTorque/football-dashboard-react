import { useState, useEffect } from "react";
import { model, store } from "./model";

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

export const useMatches = function (leagueName, subType) {
  const status =
    subType === "result"
      ? store[leagueName].matchResultStatus
      : store[leagueName].matchUpcomingStatus;

  const [matches, setMatches] = useState(
    subType === "result"
      ? store[leagueName].matchResults
      : store[leagueName].matchUpcoming
  );

  useEffect(() => {
    let ignore = false;
    if (status === "IDLE") getData();

    return () => (ignore = true);

    async function getData() {
      subType === "result"
        ? await model.getMatchResults(leagueName)
        : await model.getMatchUpcoming(leagueName);

      if (!ignore) {
        setMatches(
          subType === "result"
            ? store[leagueName].matchResults
            : store[leagueName].matchUpcoming
        );
      }
    }
  }, [subType, status, leagueName]);

  return matches;
};

export const useTopScorers = function (leagueName) {
  const status = store[leagueName].topScorersStatus;
  const [topScorers, setTopScorers] = useState(store[leagueName].topScorers);

  useEffect(() => {
    let ignore = false;
    if (status === "IDLE") getData();

    return () => (ignore = true);

    async function getData() {
      await model.getTopScorers(leagueName);

      if (!ignore) {
        setTopScorers(store[leagueName].topScorers);
      }
    }
  }, [status, leagueName]);

  return topScorers;
};
