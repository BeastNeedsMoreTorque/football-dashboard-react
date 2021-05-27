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
      editMode: false,
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

  loadTeams = async (leagueName) => {
    this.setState({
      ...this.state,
      navLoading: true,
      currentLeague: leagueName,
    });

    await model.getTeams(leagueName);

    this.setState({ ...this.state, navLoading: false });
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
              <Custom />
            </Route>
            <Route path="/league/:leagueName">
              <League
                initialDataLoaded={this.state.initialDataLoaded}
                loadTeams={this.loadTeams}
              />
            </Route>
            <Route path="/team/:leagueName/:teamName">
              <Team
                initialDataLoaded={this.state.initialDataLoaded}
                loadTeams={this.loadTeams}
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
