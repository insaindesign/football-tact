import React from "react";
import { DragSource } from "react-dnd";

import "./index.css";

function Ball({ x, y, connectDragSource, isDragging, isSelected, onClick }) {
  if (isDragging) {
    return null;
  }
  return connectDragSource(
    <div
      className={isSelected ? "Ball Ball-selected" : "Ball"}
      style={{ left: x, top: y }}
      onClick={() => onClick('ball', null)}
    />
  );
}

export default DragSource(
  "FieldItem",
  {
    beginDrag({ x, y }) {
      return { state: "ball", id: null, x, y };
    }
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })
)(Ball);
