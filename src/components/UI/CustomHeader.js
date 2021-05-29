import React from "react";
import PropTypes from "prop-types";

import { Button, Segment } from "semantic-ui-react";
import EditController from "../edit-controller/EditController";

const propTypes = {
  customs: PropTypes.array.isRequired,
  editMode: PropTypes.bool.isRequired,
  onEditBtnClick: PropTypes.func.isRequired,
  selected: PropTypes.array.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  onMoveClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onUndoClick: PropTypes.func.isRequired,
  editHistory: PropTypes.array.isRequired,
};

const style = {
  root: {
    display: "flex",
    alignItems: "center",
    transition: "all 0.2s ease-in-out",
  },
  editMode: {
    position: "sticky",
    top: "0",
    zIndex: "99",
    margin: "1rem -2rem",
  },
  text: {
    marginLeft: "2rem",
  },
};

function CustomHeader({
  customs,
  editMode,
  onEditBtnClick,
  selected,
  onSelectAllClick,
  onMoveClick,
  onDeleteClick,
  onUndoClick,
  editHistory,
}) {
  const rootStyle = editMode
    ? { ...style.root, ...style.editMode }
    : { ...style.root };

  return (
    <Segment style={rootStyle}>
      <Button
        size="small"
        onClick={onEditBtnClick}
        basic={!editMode}
        color="blue"
        disabled={!editMode && !customs.length}
        content={editMode ? "Done" : "Edit"}
      />
      {editMode ? (
        <EditController
          customs={customs}
          selected={selected}
          onSelectAll={onSelectAllClick}
          onDelete={onDeleteClick}
          onMove={onMoveClick}
          onUndo={onUndoClick}
          editHistory={editHistory}
        />
      ) : (
        <div style={style.text}>
          {customs.length
            ? "You can remove or change order of contents"
            : "No contents added yet"}
        </div>
      )}
    </Segment>
  );
}

CustomHeader.propTypes = propTypes;

export default CustomHeader;
