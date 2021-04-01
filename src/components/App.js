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
    window.scroll(0, 0);
    // set content
    this.setState({
      navLoading: true,
      // prettier-ignore
      contentData: [
        { type: "standings", data: null, leagueId, seasonId },
        { type: "matches", subType: "Result", data: null, leagueId, seasonId },
        { type: "matches", subType: "Upcoming", data: null, leagueId, seasonId },
        { type: "topScorers", data: null, leagueId, seasonId },
      ],
    });

    // set header
    model
      .getLeagueName(leagueId)
      .then((leagueName) => this.setState({ headerTitle: leagueName }));

    // get data
    const standingsData = await model.getStandingsData(leagueId, seasonId);
    const {
      teamsData,
      teamsDataArr,
      teamsDataByName,
    } = await model.getTeamsData(leagueId, standingsData);

    // render nav
    this.setState({
      navLoading: false,
      navTeams: teamsDataArr,
    });

    // render content (feed data)
    this.renderContent({ standingsData, teamsData, teamsDataByName });
  };

  onClickTeam = async ({ leagueId, teamId, teamCode }) => {
    window.scroll(0, 0);
    // set content
    const seasonId = this.state.currentSeason[leagueId];
    // prettier-ignore
    this.setState({
      contentData: [
        { type: "teamStanding", data: null, leagueId, seasonId, teamId, teamCode },
        { type: "teamNextMatch", data: null, leagueId, seasonId, teamId, teamCode },
        { type: "teamForm", data: null, leagueId, seasonId, teamId, teamCode },
      ],
    });

    // set header
    model
      .getTeamName(leagueId, teamId)
      .then((teamName) => this.setState({ headerTitle: teamName }));

    // get data
    const standingsData = await model.getStandingsData(leagueId, seasonId);
    const { teamsData, teamsDataByName } = await model.getTeamsData(
      leagueId,
      standingsData
    );

    // render content (feed data)
    this.renderContent({ standingsData, teamsData, teamsDataByName });
  };

  renderContent = ({ standingsData, teamsData, teamsDataByName }) => {
    // copy current state
    const currentData = this.state.contentData.map((v) => {
      return { ...v };
    });

    // get data, update current data (copy)
    // prettier-ignore
    currentData.forEach(async (card, i) => {
      const setDataProm = (() => {
        const { leagueId, seasonId, teamId, teamCode } = card;
        switch (card.type) {
          case "standings":
          case "teamStanding":
            currentData[i].data = { standingsData, teamsData, teamId };
            return Promise.resolve();
          case "matches":
          case "teamNextMatch":
          case "teamForm":
            // league match results, team form
            if ((card.subType && card.subType === "Result") || card.type === "teamForm")
              return model.getMatchResultsData({ leagueId, seasonId, teamCode })
                    .then(matchesData => currentData[i].data = { matchesData, teamsDataByName, teamCode });
            // league match upcoming, team match upcoming
            else
              return model.getMatchUpcomingData({ leagueId, seasonId, teamCode })
                    .then(matchesData => currentData[i].data = { matchesData, teamsDataByName, teamCode });
          case "topScorers":
            return model.getTopScorersData(leagueId, seasonId)
                  .then(topScorersData => currentData[i].data = { topScorersData, teamsDataByName });
          default:
            console.log("no match");
            return Promise.resolve();
        }
      })();

      // set state with current data (copy)
      setDataProm.then(() => this.setState({ contentData: currentData }));
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
