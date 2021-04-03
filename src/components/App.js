import "./App.css";
import React from "react";
import api from "../api/sportDataApi";
import { model } from "../model/model.js";
import { Loader, Menu, Dropdown, Segment, Button } from "semantic-ui-react";

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
import EditController from "./edit-controller/EditController";

class App extends React.Component {
  constructor(props) {
    super(props);

    window.addEventListener("beforeunload", () => {
      localStorage.setItem(
        "customData",
        JSON.stringify(Array.from(this.state.customData.values()))
      );
    });

    const customData = new Map();
    const localCustom = JSON.parse(localStorage.getItem("customData"));
    if (localCustom.length) {
      localCustom.forEach((metaData) => {
        const key = generateKey(metaData);
        customData.set(key, metaData);
      });
    }

    this.state = {
      headerTitle: "Welcome To Football Dashboard",
      navLoading: true,
      navLeagues: [],
      navTeams: [],
      contentData: [],
      customData,
      currentPage: "home",
      editMode: false,
      selected: new Map(),
    };
  }

  async componentDidMount() {
    await api.initCache("sportDataApi");
    const leagues = await model.getLeagueData();

    this.setState({ navLeagues: leagues, navLoading: false });
  }

  onCustomClick = async () => {
    window.scroll(0, 0);
    // set header
    this.setState({ headerTitle: "Custom", currentPage: "custom" });

    // set content
    const nextData = [];
    this.state.customData.forEach((metaData) => {
      nextData.push({ ...metaData, data: null });
    });

    this.setState({
      contentData: nextData,
    });

    // feed data
    nextData.forEach((metaData, index) => {
      let standingsData;
      let headerData;
      model
        .getStandingsData(metaData.leagueId, metaData.seasonId)
        .then((data) => {
          standingsData = data;
          return model.getTeamsData(metaData.leagueId, standingsData);
        })
        .then(async ({ teamsData, teamsDataByName }) => {
          if (metaData.teamId) headerData = teamsData[metaData.teamId];
          else {
            const leagues = await model.getLeagueData();
            const [leagueData] = leagues.filter(
              (l) => l.league_id === +metaData.leagueId
            );
            headerData = leagueData;
          }
          nextData[index].headerData = headerData;

          return this.renderContent(
            metaData,
            index,
            { standingsData, teamsData, teamsDataByName },
            nextData
          );
        })
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
      currentPage: "league",
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
      currentPage: "team",
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
    const { leagueId, seasonId, teamCode } = card;
    const { standingsData, teamsData, teamsDataByName } = data;

    switch (card.type) {
      case "standings":
      case "teamStanding":
        renderArr[index].data = { standingsData, teamsData };
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

  onSelectCard = (metaData) => {
    const key = generateKey(metaData);
    const update = this.state.editMode ? "selected" : "customData";
    const current = new Map(this.state[update]);

    current.has(key) ? current.delete(key) : current.set(key, { ...metaData });
    this.setState({ [update]: current });
  };

  /* Edit Mode */
  onSelectAllClick = (selectedAll) => {
    const nextSelected = selectedAll
      ? new Map()
      : new Map(this.state.customData);
    this.setState({ selected: nextSelected });
  };

  onMoveClick = (direction) => {
    // get items indices to move
    const moveIndices = [];
    Array.from(this.state.customData.keys()).forEach((key, index) => {
      if (this.state.selected.has(key)) moveIndices.push(index);
    });

    // get copy of current content data
    const currentContent = this.state.contentData.slice();
    if (direction === "right") moveIndices.reverse();

    // make swap
    moveIndices.forEach((i) => {
      const swapIndex = direction === "left" ? i - 1 : i + 1;
      // swap
      [currentContent[swapIndex], currentContent[i]] = [
        currentContent[i],
        currentContent[swapIndex],
      ];
    });

    // reset custom
    const nextCustom = new Map();
    currentContent.forEach((metaData) => {
      const key = generateKey(metaData);
      nextCustom.set(key, { ...metaData });
    });

    this.setState({
      contentData: currentContent,
      customData: nextCustom,
    });
  };

  onDeleteClick = () => {
    // get copy of current custom
    const currentCustom = new Map(this.state.customData);

    // get delete indices, delete from custom
    const deleteIndices = [];
    Array.from(currentCustom.keys()).forEach((key, index) => {
      if (this.state.selected.has(key)) {
        currentCustom.delete(key);
        deleteIndices.push(index);
      }
    });

    // set current content to null for each index
    const currentContent = this.state.contentData.slice();
    deleteIndices.forEach((i) => (currentContent[i] = null));

    this.setState({
      contentData: currentContent.filter((v) => v),
      customData: currentCustom,
      selected: new Map(),
    });
  };

  render() {
    return (
      <div className="app">
        <Sidebar editMode={this.state.editMode}>
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
          {this.state.currentPage === "custom" ? (
            <Segment
              style={
                this.state.editMode
                  ? {
                      display: "flex",
                      alignItems: "center",
                      position: "sticky",
                      top: "0",
                      zIndex: "99",
                      margin: "1rem -2rem",
                      transition: "all 0.2s linear",
                    }
                  : {
                      display: "flex",
                      alignItems: "center",
                      transition: "all 0.2s linear",
                    }
              }
            >
              <Button
                size="small"
                onClick={() =>
                  this.setState({
                    editMode: !this.state.editMode,
                    selected: new Map(),
                  })
                }
                basic={!this.state.editMode}
                color="blue"
                disabled={!this.state.editMode && !this.state.customData.size}
                style={{ marginRight: "2rem" }}
              >
                {this.state.editMode ? "Done" : "Edit"}
              </Button>
              {this.state.editMode ? (
                <EditController
                  customData={this.state.customData}
                  selected={this.state.selected}
                  onSelectAllClick={this.onSelectAllClick}
                  onMoveClick={this.onMoveClick}
                  onDeleteClick={this.onDeleteClick}
                />
              ) : (
                <div>
                  {this.state.customData.size
                    ? "You can remove or change order of contents"
                    : "No contents added yet"}
                </div>
              )}
            </Segment>
          ) : null}
          <MainContent>
            <ContentGrid
              editMode={this.state.editMode}
              selected={this.state.selected}
              contentData={this.state.contentData}
              customData={this.state.customData}
              currentPage={this.state.currentPage}
              onLeagueClick={this.onLeagueClick}
              onTeamClick={this.onTeamClick}
              onSelectCard={this.onSelectCard}
            />
          </MainContent>
        </MainDisplay>
      </div>
    );
  }
}

export default App;
