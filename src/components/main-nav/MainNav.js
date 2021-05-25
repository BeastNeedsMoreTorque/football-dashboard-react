import "./MainNav.css";
import React from "react";

import { Menu, Loader, Dropdown } from "semantic-ui-react";
import { Link } from "react-router-dom";

import LeagueDetail from "../league-detail/LeagueDetail";
import TeamDetail from "../team-detail/TeamDetail";

const style = {
  mainMenu: { position: "relative" },
  teamMenu: { maxHeight: "300px", overflowY: "scroll" },
};

function MainNav({ loading, leagues, teams }) {
  return (
    <nav className="main-nav">
      <Menu vertical={true} style={style.mainMenu} size="large">
        <Loader active={loading} />
        <Menu.Item as={Link} to="/custom" disabled={loading}>
          Custom
        </Menu.Item>
        <Dropdown text="League" item={true} disabled={loading || !leagues}>
          <Dropdown.Menu>
            {leagues?.map((league) => (
              <Dropdown.Item
                as={Link}
                to={`/league/${league.name}`}
                key={league.league_id}
              >
                <LeagueDetail {...league} />
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown text="Team" item={true} disabled={loading || !teams}>
          <Dropdown.Menu style={style.teamMenu}>
            {teams?.map((team) => (
              <Dropdown.Item
                as={Link}
                to={`/team/${team.leagueName}/${team.name}`}
                key={team.team_id}
              >
                <TeamDetail {...team} />
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Menu>
    </nav>
  );
}

export default MainNav;
