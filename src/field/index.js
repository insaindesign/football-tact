import React from "react";
import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import Pitch from "./pitch";
import "./index.css";

export default function Field({onKeyDown, onKeyUp, ...props}) {
  return (
    <DragDropContextProvider backend={HTML5Backend}>
      <div className="Field" onKeyDown={onKeyDown} onKeyUp={onKeyUp} tabIndex="0">
        <Pitch {...props} />
      </div>
    </DragDropContextProvider>
  );
}
