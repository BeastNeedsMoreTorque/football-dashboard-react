import "./App.css";
import React from "react";
import api from "../api/sportDataApi";
import { model } from "../model/model.js";
import { Loader, Menu, Dropdown } from "semantic-ui-react";

import Sidebar from "./sidebar/Sidebar";
import MainLogo from "./main-logo/MainLogo";
import MainNav from "./main-nav/MainNav";
import LeagueDetail from "./league-detail/LeagueDetail";
import TeamDetail from "./team-detail/TeamDetail";
import MainDisplay from "./main-display/MainDisplay";
import MainHeader from "./main-header/MainHeader";
import MainContent from "./main-content/MainContent";
import ContentGrid from "./content-grid/ContentGrid";

class App extends React.Component {
  state = {
    headerTitle: "Welcome To Football Dashboard",
    currentSeason: {},
    navLoading: true,
    navLeagues: [],
    navTeams: [],
    contentData: [],
  };

  async componentDidMount() {
    await api.initCache("sportDataApi");

    const leagues = await model.getLeagueData();

    const currentSeason = {};

    leagues.forEach((league) => {
      currentSeason[league.league_id] = league.season_id + "";
    });

    this.setState({ currentSeason, navLeagues: leagues, navLoading: false });
  }

  onClickLeague = async ({ leagueId, seasonId }) => {
    this.setState({
      navLoading: true,
      contentData: [
        { type: "standings", data: null },
        { type: "matches", subType: "Result", data: null },
        { type: "matches", subType: "Upcoming", data: null },
        { type: "topScorers", data: null },
      ],
    });

    model
      .getLeagueName(leagueId)
      .then((leagueName) => this.setState({ headerTitle: leagueName }));

    const standingsData = await model.getStandingsData(leagueId, seasonId);
    const {
      teamsData,
      teamsDataArr,
      teamsDataByName,
    } = await model.getTeamsData(leagueId, standingsData);

    const currentData = this.state.contentData.map((v) => {
      return { ...v };
    });
    currentData[0].data = { standingsData, teamsData };

    this.setState({
      navLoading: false,
      navTeams: teamsDataArr,
      contentData: currentData,
    });

    model.getMatchResultsData(leagueId, seasonId).then((matchesData) => {
      currentData[1].data = { matchesData, teamsDataByName };
      this.setState({ contentData: currentData });
    });

    model.getMatchUpcomingData(leagueId, seasonId).then((matchesData) => {
      currentData[2].data = { matchesData, teamsDataByName };
      this.setState({ contentData: currentData });
    });

    model.getTopScorersData(leagueId, seasonId).then((topScorersData) => {
      currentData[3].data = { topScorersData, teamsDataByName };
      this.setState({ contentData: currentData });
    });
  };

  onClickTeam = async ({ leagueId, teamId, teamCode }) => {
    const seasonId = this.state.currentSeason[leagueId];

    this.setState({
      contentData: [
        { type: "teamStanding", data: null },
        { type: "teamNextMatch", data: null },
        { type: "teamForm", data: null },
      ],
    });

    model
      .getTeamName(leagueId, teamId)
      .then((teamName) => this.setState({ headerTitle: teamName }));

    const standingsData = await model.getStandingsData(leagueId, seasonId);
    const { teamsData, teamsDataByName } = await model.getTeamsData(
      leagueId,
      standingsData
    );

    const currentData = this.state.contentData.map((v) => {
      return { ...v };
    });

    currentData[0].data = { standingsData, teamsData, teamId };
    this.setState({
      contentData: currentData,
    });

    model
      .getMatchUpcomingData(leagueId, seasonId, true, teamCode)
      .then((matchesData) => {
        currentData[1].data = { matchesData, teamsDataByName, teamCode };
        this.setState({ contentData: currentData });
      });

    model
      .getMatchResultsData(leagueId, seasonId, true, teamCode)
      .then((matchesData) => {
        currentData[2].data = { matchesData, teamsDataByName, teamCode };
        this.setState({ contentData: currentData });
      });
  };

  render() {
    return (
      <div className="app">
        <Sidebar>
          <MainLogo />
          <MainNav>
            <Menu vertical={true} style={{ position: "relative" }} size="large">
              <Loader active={this.state.navLoading} />
              <Menu.Item
                link={true}
                name="Custom"
                disabled={this.state.navLoading}
              >
                Custom
              </Menu.Item>
              <Dropdown
                text="League"
                item={true}
                disabled={this.state.navLoading}
              >
                <Dropdown.Menu
                  onClick={(e) => {
                    const { leagueId, seasonId } = e.target
                      .closest(".item")
                      .querySelector(".league-detail").dataset;
                    this.onClickLeague({ leagueId, seasonId });
                  }}
                >
                  {this.state.navLeagues.map((league) => (
                    <Dropdown.Item key={league.league_id}>
                      <LeagueDetail {...league} />
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown
                text="Team"
                item={true}
                disabled={
                  this.state.navLoading || this.state.navTeams.length === 0
                }
              >
                <Dropdown.Menu
                  style={{ maxHeight: "300px", overflowY: "scroll" }}
                  onClick={(e) => {
                    const { leagueId, teamId, teamCode } = e.target
                      .closest(".item")
                      .querySelector(".team-detail").dataset;
                    this.onClickTeam({ leagueId, teamId, teamCode });
                  }}
                >
                  {this.state.navTeams.map((team) => (
                    <Dropdown.Item key={team.team_id}>
                      <TeamDetail {...team} />
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Menu>
          </MainNav>
        </Sidebar>
        <MainDisplay>
          <MainHeader title={this.state.headerTitle} />
          <MainContent>
            <ContentGrid
              contentData={this.state.contentData}
              onClickTeam={this.onClickTeam}
            />
          </MainContent>
        </MainDisplay>
      </div>
    );
  }
}

export default App;
