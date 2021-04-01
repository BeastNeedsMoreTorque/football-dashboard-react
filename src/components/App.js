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
import { generateKey } from "../others/helper";

class App extends React.Component {
  state = {
    headerTitle: "Welcome To Football Dashboard",
    navLoading: true,
    navLeagues: [],
    navTeams: [],
    contentData: [],
    customData: new Map(),
  };

  async componentDidMount() {
    await api.initCache("sportDataApi");

    const leagues = await model.getLeagueData();

    this.setState({ navLeagues: leagues, navLoading: false });
  }

  onCustomClick = async () => {
    window.scroll(0, 0);

    const nextData = [];
    this.state.customData.forEach((metaData) => {
      nextData.push({ ...metaData, data: null });
    });

    // set content, header
    this.setState({
      contentData: nextData,
      headerTitle: "Custom",
    });

    nextData.forEach((metaData, index) => {
      let standingsData;
      model
        .getStandingsData(metaData.leagueId, metaData.seasonId)
        .then((data) => {
          standingsData = data;
          return model.getTeamsData(metaData.leagueId, standingsData);
        })
        .then(({ teamsData, teamsDataByName }) =>
          this.renderContent(
            metaData,
            index,
            { standingsData, teamsData, teamsDataByName },
            nextData
          )
        )
        .then(() => this.setState({ contentData: nextData }));
    });
  };

  onLeagueClick = async (leagueMetaData) => {
    window.scroll(0, 0);
    // set content
    this.setState({
      navLoading: true,
      // prettier-ignore
      contentData: [
        { type: "standings", data: null, ...leagueMetaData },
        { type: "matches", subType: "result", data: null, ...leagueMetaData },
        { type: "matches", subType: "upcoming", data: null, ...leagueMetaData },
        { type: "topScorers", data: null, ...leagueMetaData },
      ],
    });

    // set header
    model
      .getLeagueName(leagueMetaData.leagueId)
      .then((leagueName) => this.setState({ headerTitle: leagueName }));

    // get data
    const standingsData = await model.getStandingsData(
      leagueMetaData.leagueId,
      leagueMetaData.seasonId
    );
    const {
      teamsData,
      teamsDataArr,
      teamsDataByName,
    } = await model.getTeamsData(leagueMetaData.leagueId, standingsData);

    // render nav
    this.setState({
      navLoading: false,
      navTeams: teamsDataArr.map((teamData) =>
        Object.assign({
          leagueId: leagueMetaData.leagueId,
          seasonId: leagueMetaData.seasonId,
          ...teamData,
        })
      ),
    });

    const currentData = this.state.contentData.map((card) => {
      return { ...card };
    });

    // render content (feed data)
    currentData.forEach((card, index) => {
      this.renderContent(
        card,
        index,
        { standingsData, teamsData, teamsDataByName },
        currentData
      ).then(() => this.setState({ contentData: currentData }));
    });
  };

  onTeamClick = async (teamMetaData) => {
    window.scroll(0, 0);
    // set content
    // prettier-ignore
    this.setState({
      contentData: [
        { type: "teamStanding", data: null, ...teamMetaData },
        { type: "teamNextMatch", data: null, ...teamMetaData },
        { type: "teamForm", data: null, ...teamMetaData },
      ],
    });

    // set header
    model
      .getTeamName(teamMetaData.leagueId, teamMetaData.teamId)
      .then((teamName) => this.setState({ headerTitle: teamName }));

    // get data
    const standingsData = await model.getStandingsData(
      teamMetaData.leagueId,
      teamMetaData.seasonId
    );
    const { teamsData, teamsDataByName } = await model.getTeamsData(
      teamMetaData.leagueId,
      standingsData
    );

    const currentData = this.state.contentData.map((v) => {
      return { ...v };
    });

    // render content (feed data)
    currentData.forEach((card, index) => {
      this.renderContent(
        card,
        index,
        { standingsData, teamsData, teamsDataByName },
        currentData
      ).then(() => this.setState({ contentData: currentData }));
    });
  };

  renderContent = (card, index, data, renderArr) => {
    const { leagueId, seasonId, teamId, teamCode } = card;
    const { standingsData, teamsData, teamsDataByName } = data;

    switch (card.type) {
      case "standings":
      case "teamStanding":
        renderArr[index].data = { standingsData, teamsData, teamId };
        return Promise.resolve();
      case "matches":
      case "teamNextMatch":
      case "teamForm":
        let getMatchFunction;
        // prettier-ignore
        if ((card.subType && card.subType === "result") ||
          card.type === "teamForm")
        // league match results, team form
          getMatchFunction = model.getMatchResultsData;
        // league match upcoming, team match upcoming
        else getMatchFunction = model.getMatchUpcomingData;
        return getMatchFunction({ leagueId, seasonId, teamCode }).then(
          (matchesData) =>
            (renderArr[index].data = {
              matchesData,
              teamsDataByName,
              teamCode,
            })
        );
      case "topScorers":
        return model
          .getTopScorersData(leagueId, seasonId)
          .then(
            (topScorersData) =>
              (renderArr[index].data = { topScorersData, teamsDataByName })
          );
      default:
        console.log("no match");
        return Promise.resolve();
    }
  };

  onCardToggleChange = (metaData) => {
    const key = generateKey(metaData);

    const currentMap = new Map(this.state.customData);
    currentMap.has(key)
      ? currentMap.delete(key)
      : currentMap.set(key, { ...metaData });
    this.setState({ customData: currentMap });
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
                onClick={this.onCustomClick}
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
                    this.onLeagueClick({ leagueId, seasonId });
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
                    const {
                      leagueId,
                      seasonId,
                      teamId,
                      teamCode,
                    } = e.target
                      .closest(".item")
                      .querySelector(".team-detail").dataset;
                    this.onTeamClick({ leagueId, seasonId, teamId, teamCode });
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
              customData={this.state.customData}
              onTeamClick={this.onTeamClick}
              onCardToggleChange={this.onCardToggleChange}
            />
          </MainContent>
        </MainDisplay>
      </div>
    );
  }
}

export default App;
