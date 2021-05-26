export const useNames = function (params) {
  const { leagueName, teamName } = params;

  return {
    leagueName: leagueName.replaceAll("-", " "),
    teamName: teamName?.replaceAll("-", " "),
  };
};
