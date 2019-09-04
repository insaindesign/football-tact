import React from "react";
import { DragSource } from "react-dnd";

import "./index.css";

function Player({ team, player, id, connectDragSource, isDragging, onClick, isSelected }) {
  if (isDragging) {
    return null;
  }
  return connectDragSource(
    <div
      className={"Player Player-" + team + (isSelected ? ' Player-selected':'')}
      onClick={()=>onClick(team, id)}
      style={{ left: player.x, top: player.y }}>
      <span className="Player-text">{id}</span>
    </div>
  );
}

export default DragSource(
  "FieldItem",
  {
    beginDrag({ team, player, id }) {
      return { state: team, id, x: player.x, y: player.y };
    }
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })
)(Player);
