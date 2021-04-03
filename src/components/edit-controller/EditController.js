import React from "react";
import PropTypes from "prop-types";
import { Button, Icon, Popup } from "semantic-ui-react";

const propTypes = {
  customData: PropTypes.object.isRequired,
  selected: PropTypes.object.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  onMoveClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};

function EditController({
  customData,
  selected,
  onSelectAllClick,
  onMoveClick,
  onDeleteClick,
}) {
  const selectedAll = selected.size && customData.size === selected.size;
  const keys = Array.from(customData.keys());

  return (
    <>
      <Button.Group basic size="small">
        <Popup
          size="small"
          content={selectedAll ? "Unselect All" : "Select All"}
          trigger={
            <Button icon onClick={() => onSelectAllClick(selectedAll)}>
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
              disabled={selected.has(keys[0]) || !selected.size}
              onClick={() => onMoveClick("left")}
            />
          }
        />
        <Popup
          size="small"
          content="Move Right"
          trigger={
            <Button
              icon="arrow right"
              disabled={selected.has(keys[keys.length - 1]) || !selected.size}
              onClick={() => onMoveClick("right")}
            />
          }
        />
        <Button
          icon="trash"
          disabled={!selected.size}
          onClick={() => {
            if (
              window.confirm(
                `Remove ${selected.size} item${selected.size > 1 ? "s" : ""}?`
              )
            )
              onDeleteClick();
          }}
        />
      </Button.Group>
      <div style={{ marginLeft: "1rem" }}>
        {selected.size} content{selected.size > 1 ? "s" : ""} selected
      </div>
    </>
  );
}

EditController.propTypes = propTypes;

export default EditController;
