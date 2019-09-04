import React from "react";
import { DropTarget } from "react-dnd";

function Pitch({ width, height, children, connectDropTarget }) {
  const centercircleDiam = height / 3;
  const penBoxHeight = height / 2;
  const penBoxWidth = width / 5;
  const goalHeight = height / 5;
  const goalWidth = 10;
  return connectDropTarget(
    <div className="Field-pitch" style={{ width, height }}>
      <div className="Field-centerline" style={{ left: width / 2, height }} />
      <div
        className="Field-centercircle"
        style={{
          left: width / 2 - centercircleDiam / 2,
          height: centercircleDiam,
          width: centercircleDiam,
          top: height / 2 - centercircleDiam / 2
        }}
      />
      <div
        className="Field-penbox"
        style={{
          left: -2,
          height: penBoxHeight,
          width: penBoxWidth,
          top: height / 2 - penBoxHeight / 2
        }}
      />
      <div
        className="Field-penbox"
        style={{
          right: -2,
          height: penBoxHeight,
          width: penBoxWidth,
          top: height / 2 - penBoxHeight / 2
        }}
      />
      <div
        className="Field-goal"
        style={{
          left: -(goalWidth + 4),
          height: goalHeight,
          width: goalWidth,
          top: height / 2 - goalHeight / 2
        }}
      />
      <div
        className="Field-goal"
        style={{
          right: -(goalWidth + 4),
          height: goalHeight,
          width: goalWidth,
          top: height / 2 - goalHeight / 2
        }}
      />
      {children}
    </div>
  );
}

export default DropTarget(
  "FieldItem",
  {
    drop(props, monitor) {
      const item = monitor.getItem();
      const delta = monitor.getDifferenceFromInitialOffset();
      const x = item.x + delta.x;
      const y = item.y + delta.y;
      props.onMoveItem(item.state, item.id, x, y);
    }
  },
  connect => ({
    connectDropTarget: connect.dropTarget()
  })
)(Pitch);
