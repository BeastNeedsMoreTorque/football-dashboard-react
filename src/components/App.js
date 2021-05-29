import "./App.css";
import React from "react";
import { Route, Switch } from "react-router-dom";
import api from "../api/sportDataApi";
import { model } from "../model/model.js";

import Sidebar from "./UI/Sidebar";
import MainLogo from "./UI/MainLogo";
import MainNav from "./UI/MainNav";
import MainDisplay from "./UI/MainDisplay";

// pages
import Home from "../pages/Home";
import Custom from "../pages/Custom";
import League from "../pages/League";
import Team from "../pages/Team";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initialDataLoaded: false,
      navLoading: true,
      currentLeague: "",
      currentTeam: "",
      customs: JSON.parse(localStorage.getItem("customs")) || [],
      editMode: false,
      selected: [],
      editHistory: [],
    };
  }

  async componentDidMount() {
    await api.initCache("sportDataApi");
    await model.getLeagues();

    this.setState({
      ...this.state,
      initialDataLoaded: true,
      navLoading: false,
    });
  }

  componentDidUpdate(_, prevState) {
    if (prevState.customs !== this.state.customs) {
      localStorage.setItem("customs", JSON.stringify(this.state.customs));
    }
  }

  loadTeams = async (...leagueNames) => {
    if (!leagueNames.length) return;

    this.setState({
      ...this.state,
      navLoading: true,
      currentLeague: leagueNames[0],
    });

    await Promise.all(
      leagueNames.map((leagueName) => model.getTeams(leagueName))
    );

    this.setState({ ...this.state, navLoading: false });
  };

  onCardSelect = (cardKey) => {
    const nextState = this.state.editMode
      ? [...this.state.selected]
      : [...this.state.customs];
    const index = nextState.findIndex((key) => key === cardKey);

    if (index === -1) nextState.push(cardKey);
    else nextState.splice(index, 1);

    this.setState({
      ...this.state,
      [this.state.editMode ? "selected" : "customs"]: nextState,
    });
  };

  // Edit Mode
  onEditBtnClick = () => {
    this.setState({
      ...this.state,
      selected: [],
      editMode: !this.state.editMode,
      editHistory: [],
    });
  };

  onSelectAllClick = (selectedAll) => {
    const nextSelected = selectedAll ? [] : [...this.state.customs];
    this.setState({ ...this.state, selected: nextSelected });
  };

  onMoveClick = (direction) => {
    const nextCustom = [...this.state.customs];
    const willMove = [
      ...this.state.customs.filter((key) => this.state.selected.includes(key)),
    ];
    if (direction === "right") willMove.reverse();

    willMove.forEach((key) => {
      const index = nextCustom.findIndex((_key) => _key === key);
      const swapWith = direction === "right" ? index + 1 : index - 1;

      [nextCustom[index], nextCustom[swapWith]] = [
        nextCustom[swapWith],
        nextCustom[index],
      ];
    });

    const history = {
      customs: this.state.customs,
      selected: this.state.selected,
    };

    this.setState({
      ...this.state,
      customs: nextCustom,
      editHistory: [...this.state.editHistory, history],
    });
  };

  onDeleteClick = () => {
    const nextCustom = this.state.customs.filter(
      (key) => !this.state.selected.includes(key)
    );
    const history = {
      customs: this.state.customs,
      selected: this.state.selected,
    };

    this.setState({
      ...this.state,
      selected: [],
      customs: nextCustom,
      editHistory: [...this.state.editHistory, history],
    });
  };

  onUndoClick = () => {
    const nextEditHistory = [...this.state.editHistory];
    const { selected, customs } = nextEditHistory.pop();

    this.setState({
      ...this.state,
      selected,
      customs,
      editHistory: nextEditHistory,
    });
  };

  render() {
    return (
      <div className="app">
        <Sidebar editMode={this.state.editMode}>
          <MainLogo />
          <MainNav
            loading={this.state.navLoading}
            currentLeague={this.state.currentLeague}
          />
        </Sidebar>
        <MainDisplay>
          <Switch>
            <Route path="/custom">
              <Custom
                initialDataLoaded={this.state.initialDataLoaded}
                loadTeams={this.loadTeams}
                customs={this.state.customs}
                editMode={this.state.editMode}
                selected={this.state.selected}
                onEditBtnClick={this.onEditBtnClick}
                onCardSelect={this.onCardSelect}
                onSelectAllClick={this.onSelectAllClick}
                onMoveClick={this.onMoveClick}
                onDeleteClick={this.onDeleteClick}
                onUndoClick={this.onUndoClick}
                editHistory={this.state.editHistory}
              />
            </Route>
            <Route path="/league/:leagueName">
              <League
                initialDataLoaded={this.state.initialDataLoaded}
                loadTeams={this.loadTeams}
                customs={this.state.customs}
                onCardSelect={this.onCardSelect}
              />
            </Route>
            <Route path="/team/:leagueName/:teamName">
              <Team
                initialDataLoaded={this.state.initialDataLoaded}
                loadTeams={this.loadTeams}
                customs={this.state.customs}
                onCardSelect={this.onCardSelect}
              />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </MainDisplay>
      </div>
    );
  }
}

export default App;
