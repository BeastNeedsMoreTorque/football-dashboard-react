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
- Render logic
  - Vanilla JS (Before): Explicitly rendered placeholders on click, get data from model, then called each commponents' render method.
  - React (Now): Managed `currentLeague(Team)`, `(data)`, `(data)Status` and more as state, rendered when state changes.
  - Lots of responsibilities(and codes) in `App.js` split to page components, each cards.
  
- Router
  - Used react-router-dom
  - Descriptive URL
  - Created 'page components'; Readable composition structure in `App.js`
  <br>
  
  ```jsx
  return (
    <div className="app">
      <Sidebar>
        <MainLogo />
        <MainNav />
      </Sidebar>
      <MainDisplay>
        <Switch>
          <Route path="/custom">
            <Custom />
          </Route>
          <Route path="/league/:leagueName">
            <League />
          </Route>
          <Route path="/team/:leagueName/:teamName">
            <Team />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </MainDisplay>
    </div>
  );
  ```

- Used [semantic ui](https://react.semantic-ui.com/) for more readable, clear UI.
  - Before
    ![ui_before](https://user-images.githubusercontent.com/31500012/113542135-97820d00-961e-11eb-96bf-0b6af8c27d3a.png)
  - Now
    ![ui_after](https://user-images.githubusercontent.com/31500012/113541915-1e82b580-961e-11eb-9f8a-9444313b4362.png)

- Changed directory structure; Less nested, based on each component's functionalities.

## To be updated
- Mobile View
- Redux
