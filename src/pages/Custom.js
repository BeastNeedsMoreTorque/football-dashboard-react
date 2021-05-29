import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";

import MainHeader from "../components/UI/MainHeader";
import MainContent from "../components/UI/MainContent";
import CardTemplate from "../components/cards/CardTemplate";
import { Grid, Loader } from "semantic-ui-react";
import CustomHeader from "../components/UI/CustomHeader";

const propTypes = {
  initialDataLoaded: PropTypes.bool.isRequired,
  loadTeams: PropTypes.func.isRequired,
  customs: PropTypes.array.isRequired,
  editMode: PropTypes.bool.isRequired,
  onEditBtnClick: PropTypes.func.isRequired,
  selected: PropTypes.array.isRequired,
  onCardSelect: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  onMoveClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onUndoClick: PropTypes.func.isRequired,
  editHistory: PropTypes.array.isRequired,
};

function Custom({
  initialDataLoaded,
  loadTeams,
  customs,
  editMode,
  onEditBtnClick,
  selected,
  onCardSelect,
  onSelectAllClick,
  onMoveClick,
  onDeleteClick,
  onUndoClick,
  editHistory,
}) {
  const leagueNames = useMemo(
    () => Array.from(new Set(customs.map((cardKey) => cardKey.split("-")[0]))),
    [customs]
  );

  useEffect(() => {
    if (initialDataLoaded) loadTeams(...leagueNames);
  }, [initialDataLoaded, loadTeams, leagueNames]);

  if (!initialDataLoaded) return <Loader size="large" active={true} />;

  return (
    <>
      <MainHeader>
        <h2>Custom</h2>
      </MainHeader>
      <CustomHeader
        customs={customs}
        editMode={editMode}
        onEditBtnClick={onEditBtnClick}
        selected={selected}
        onSelectAllClick={onSelectAllClick}
        onMoveClick={onMoveClick}
        onDeleteClick={onDeleteClick}
        onUndoClick={onUndoClick}
        editHistory={editHistory}
      />
      <MainContent editMode={editMode}>
        <Grid>
          {customs.map((cardKey) => {
            const [leagueName, teamName, type] = cardKey.split("-");
            return (
              <CardTemplate
                key={cardKey}
                type={type}
                currentLeague={leagueName}
                currentTeam={teamName}
                editMode={editMode}
                onCardSelect={onCardSelect}
                selected={selected}
              />
            );
          })}
        </Grid>
      </MainContent>
    </>
  );
}

Custom.propTypes = propTypes;

export default Custom;
