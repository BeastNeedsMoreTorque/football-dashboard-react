# ⚽ Football Dashboard - React

- Rebuilding [Football Dashboard](https://github.com/sanginchun/football-dashboard) in react.

## Table of Contents

- [Description](https://github.com/sanginchun/football-dashboard-react#description)
- [Other Versions](https://github.com/sanginchun/football-dashboard-react#other-versions)
- [Live Demo](https://github.com/sanginchun/football-dashboard-react#live-demo)
- [Improvements](https://github.com/sanginchun/football-dashboard-react#improvements)
- [To Be Updated](https://github.com/sanginchun/football-dashboard-react#to-be-updated)

## Description

- Football dashboard is a single-page application that shows up-to-date information about football leagues and teams.
- Used [SportDataApi](https://sportdataapi.com/football-soccer-api) which is not a public api, so error might occur due to the request limit.
- Made as a personal project to improve understanding in React.

## Other Versions

- [Vanilla JS](https://github.com/sanginchun/football-dashboard)
- [React + Redux](https://github.com/sanginchun/football-dashboard-react-redux)

## Live Demo

- [https://football-dashboard-react.netlify.app/](https://football-dashboard-react.netlify.app/)

## Improvements

- Used [semantic ui](https://react.semantic-ui.com/) for more readable, clear UI.

  - Before
    ![ui_before](https://user-images.githubusercontent.com/31500012/113542135-97820d00-961e-11eb-96bf-0b6af8c27d3a.png)

  - After
    ![ui_after](https://user-images.githubusercontent.com/31500012/113541915-1e82b580-961e-11eb-9f8a-9444313b4362.png)

- Making components reusable
  - [TeamDetail.js](https://github.com/sanginchun/football-dashboard-react/blob/master/src/components/team-detail/TeamDetail.js) </br>
    ![team_detail](https://user-images.githubusercontent.com/31500012/113542674-be8d0e80-961f-11eb-9449-2f2f20cb04b5.png)
  - [LeagueDetail.js](https://github.com/sanginchun/football-dashboard-react/blob/master/src/components/league-detail/LeagueDetail.js)
- Refactored placeholder & actual data rendering code

  - Before: Explicitly calling a method to render placeholder, then calling render method for each content instance with data.

  ```JavaScript
  // In App.js

  this.mainContent.renderPlaceholder();

  /////////////////////////
  /* fetch data from API */
  /////////////////////////

  this.mainContent.standings.render({ ...data });
  this.mainContent.matchResult.render({ ...otherData });
  ```

  - After: Managing content data as a state, passing as props & conditional rendering on each instance. More managable, scalable code especially when adding a new content or a new page.

  ```JavaScript
  // In App.js

  this.setState({ contentData: [{ type: "standings", data: null }, { type: "match", subType: "result", data: null }] });

  /////////////////////////
  /* fetch data from API */
  /////////////////////////

  this.setState({ contentData: [{ type: "standings", data }, { type: "match", subType: "result", data: otherData }] });
  ```

  ```JavaScript
  // In ContentCard.js
  import React from "react";
  import Placeholder from "./Placeholder";
  import Standings from "./Standings";

  function ContentCard({ data }) {
    return (
      <CardHeader />
      <CardBody>
        {data ? <Standings {...data} /> : <Placeholder />}
      </CardBody>
    );
  }
  ```

- Refactored local storage update conditions

  - Before: Custom data on local storage was updated explicitly each time when user adds/deletes content or changes order of the contents on custom page.
  - After: Used componentDidUpdate(), checking if custom data was changed and then updates.

  ```JavaScript
  // in App.js

  componentDidUpdate(_, prevState) {
    if (prevState.customData !== this.state.customData) {
      localStorage.setItem(
        "customData",
        JSON.stringify(Array.from(this.state.customData.values()))
      );
    }
  }
  ```

- Added 'Undo' functionality on editing custom page

  - Managing editHistory as a state, making possible for user to undo the changes in edit mode.

  ```JavaScript
  // in App.js

  /* Edit Mode */
  onMoveClick() {
    // make changes
    // ...

    const history = {
      customData: this.state.customData,
      contentData: this.state.contentData,
    };
    this.setState({ editHistory: editHistory.concat([history]), ...otherChanges });
  }
  onDeleteClick() {
    // same logic as above
  }

  onUndoClick() {
    this.setState({
      customData: this.state.editHistory[this.state.editHistory.length - 1].customData,
      contentData: this.state.editHistory[this.state.editHistory.length - 1].contentData,
      editHistory: this.state.editHistory.slice(0, this.state.editHistory.length - 1),
    });
  }
  ```

## To be updated

# <<<<<<< HEAD

- Redux
  > > > > > > > 566883fc920205a878cd14ade02322c58fdb806f
- Router
- Managing users
- Multiple custom pages
