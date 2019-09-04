import React from "react";
import Modal from "react-modal";

import "./index.css";

const ref = React.createRef();
export default function ImportModal({ show, onImport }) {
  if (show === null) {
    return null;
  }
  const blob = new Blob([show], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  return (
    <Modal isOpen={true} style={{ overlay: { zIndex: 10, backgroundColor: "rgba(0,0,0,0.5)" } }} onRequestClose={onImport}>
      <textarea className="InputModal-text" ref={ref} defaultValue={show} />
      <button onClick={() => ref.current.value ? onImport(ref.current.value) : null}>Import</button>
      {show ? (
        <a href={url} download="game.json">
          Download as file
        </a>
      ) : null}
    </Modal>
  );
}
