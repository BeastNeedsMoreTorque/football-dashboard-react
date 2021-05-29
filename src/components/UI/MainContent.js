import React from "react";

function MainContent(props) {
  return (
    <section
      className="main-content"
      style={props.editMode ? { opacity: "0.7" } : null}
      onClickCapture={(e) => {
        if (props.editMode && e.target.closest("a")) {
          alert("Finish Editing First");
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      {props.children}
    </section>
  );
}

export default MainContent;
