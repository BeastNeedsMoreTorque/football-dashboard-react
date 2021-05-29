import React from "react";
import PropTypes from "prop-types";
import { Button, Icon, Popup } from "semantic-ui-react";

const propTypes = {
  customs: PropTypes.array.isRequired,
  selected: PropTypes.array.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUndo: PropTypes.func.isRequired,
  editHistory: PropTypes.array.isRequired,
};

const style = { root: { marginLeft: "auto" } };

function EditController({
  customs,
  selected,
  onSelectAll,
  onMove,
  onDelete,
  onUndo,
  editHistory,
}) {
  const selectedAll = customs.length && customs.length === selected.length;

  return (
    <div style={style.root}>
      <Button.Group basic size="small">
        <Popup
          size="small"
          content={selectedAll ? "Unselect All" : "Select All"}
          trigger={
            <Button
              icon
              disabled={!customs.length}
              onClick={() => onSelectAll(selectedAll)}
            >
              <Icon
                size="large"
                name={selectedAll ? "check square outline" : "square outline"}
              />
            </Button>
          }
        />
        <Popup
          size="small"
          content="Move Left"
          trigger={
            <Button
              icon="arrow left"
              disabled={!selected.length || selected.includes(customs[0])}
              onClick={() => onMove("left")}
            />
          }
        />
        <Popup
          size="small"
          content="Move Right"
          trigger={
            <Button
              icon="arrow right"
              disabled={
                !selected.length ||
                selected.includes(customs[customs.length - 1])
              }
              onClick={() => onMove("right")}
            />
          }
        />
        <Button
          icon="trash"
          disabled={!selected.length}
          onClick={() => {
            if (
              window.confirm(
                `Remove ${selected.length} content${
                  selected.length > 1 ? "s" : ""
                }?`
              )
            )
              onDelete();
          }}
        />
        <Button icon="undo" disabled={!editHistory.length} onClick={onUndo} />
      </Button.Group>
    </div>
  );
}

EditController.propTypes = propTypes;

export default EditController;
