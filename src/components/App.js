import "./App.css";
import React from "react";
import api from "../api/sportDataApi";
import { model } from "../model/model.js";

import Sidebar from "./UI/Sidebar";
import MainLogo from "./UI/MainLogo";
import MainNav from "./UI/MainNav";
import MainDisplay from "./UI/MainDisplay";
import { Route, Switch } from "react-router-dom";

// pages
import Home from "../pages/Home";
import Custom from "../pages/Custom";
import League from "../pages/League";
import Team from "../pages/Team";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nav: { leagues: null, teams: null, loading: true },
      league: null,
      teams: null,
      teamsByName: null,
      editMode: false,
    };
  }

  async componentDidMount() {
    await api.initCache("sportDataApi");
    const leagues = await model.getLeagues();

    this.setState({ nav: { ...this.state.nav, leagues, loading: false } });
  }

  loadNav = async (urlLeagueName) => {
    this.setState({
      nav: { ...this.state.nav, loading: true },
      teams: null,
      teamsByName: null,
    });
    const leagueName = urlLeagueName.replaceAll("-", " ");

    const league = model.getLeague(leagueName);
    const {
      teamsArr: navTeams,
      teams,
      teamsByName,
    } = await model.getTeams(leagueName);

    this.setState({
      league,
      teams,
      teamsByName,
      nav: { ...this.state.nav, teams: navTeams, loading: false },
    });
  };

  render() {
    return (
      <div className="app">
        <Sidebar editMode={this.state.editMode}>
          <MainLogo />
          <MainNav {...this.state.nav} />
        </Sidebar>
        <MainDisplay>
          <Switch>
            <Route path="/custom">
              <Custom />
            </Route>
            <Route path="/league/:leagueName">
              <League
                initialDataLoaded={!!this.state.nav.leagues}
                loadNav={this.loadNav}
                league={this.state.league}
                teams={this.state.teams}
                teamsByName={this.state.teamsByName}
              />
            </Route>
            <Route path="/team/:leagueName/:teamName">
              <Team
                initialDataLoaded={!!this.state.nav.leagues}
                loadNav={this.loadNav}
                teams={this.state.teams}
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
