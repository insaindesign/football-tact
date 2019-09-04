import React, { Component, Fragment } from "react";
import produce from "immer";

import Field from "../field";
import Ball from "../ball";
import Player from "../player";
import ImportModal from "../import_modal";

import "./index.css";

const objEach = (obj, callback) => {
  // go home eslint, you're drunk
  // eslint-disable-next-line
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      callback(obj[key], key);
    }
  }
};
const sanitiseNumber = val => {
  const num = parseInt(val, 10);
  return num && !isNaN(num) ? Math.abs(num) : 0;
};

const ARROW_KEYCODES = [37, 38, 39, 40];

export default class App extends Component {
  state = {
    playing: false,
    showImport: "",
    fps: 10,
    selected: null,
    height: 480,
    width: 800,
    game: null,
    ball: {},
    away: {},
    home: {},
    frame: 0
  };

  _fromPx = (item, currentPos) =>
    produce(currentPos || {}, draft => {
      if (item && item.x >= 0 && item.y >= 0) {
        draft.x = ((item.x / this.state.width) * 100).toFixed(3);
        draft.y = ((item.y / this.state.height) * 100).toFixed(3);
      } else {
        draft = null;
      }
    });

  _toPx = (item, currentPos) =>
    produce(currentPos, draft => {
      draft.x =
        item && item.x
          ? Math.round((item.x * this.state.width) / 100)
          : currentPos.x || -10;
      draft.y =
        item && item.y
          ? Math.round((item.y * this.state.height) / 100)
          : currentPos.y || -10;
    });

  _setPlayerPositions = (game, frame, stateKey) => {
    const currentState = this.state ? this.state[stateKey] : {};
    const team = game[frame][stateKey];
    return produce(currentState, draft => {
      objEach(team, (_, id) => {
        if ((!team[id] && frame > 0) || this._isSelected(stateKey, id)) {
          return;
        }
        draft[id] = this._toPx(
          team[id],
          frame === 0 ? {} : currentState[id] || {}
        );
      });
    });
  };

  _updateGame(currentGame, frame, ball, home, away) {
    return produce(currentGame, draft => {
      const currentFrame = currentGame[frame];
      const draftFrame = draft[frame];
      draftFrame.ball = this._fromPx(ball, currentFrame.ball);
      objEach(away, (val, id) => {
        draftFrame.away[id] = this._fromPx(val, currentFrame.away[id]);
      });
      objEach(home, (val, id) => {
        draftFrame.home[id] = this._fromPx(val, currentFrame.home[id]);
      });
    });
  }

  _getFrameStateForGame = (frame, currentGame) => {
    if (!currentGame[frame]) {
      throw new Error("No such frame");
    }

    const ball = this._toPx(
      !this._isSelected('ball') ? currentGame[frame].ball : {},
      (this.state && this.state.ball) || {}
    );
    const away = this._setPlayerPositions(currentGame, frame, "away");
    const home = this._setPlayerPositions(currentGame, frame, "home");
    const game = this._updateGame(currentGame, frame, ball, home, away);

    return { frame, ball, home, away, game };
  };

  _getFrameState = frame => {
    return this._getFrameStateForGame(frame, this.state.game);
  };

  _playPause = () => {
    clearTimeout(this.timer);
    this.setState({ playing: !this.state.playing });
  };

  _reset = () => {
    const playing = this.state.playing;
    this.setState({ selected: false, playing: false }, () => {
      this.setState({ ...this._getFrameState(0), playing });
    });
  };

  _setNextFrameState = () => {
    try {
      this.setState(this._getFrameState(this.state.frame + 1));
    } catch (err) {
      if (this.state.frame) {
        this._reset();
      } else {
        this.setState({ playing: false });
      }
    }
  };

  componentDidUpdate(_prevProps, prevState) {
    const { playing, fps, away, home, ball, game, frame } = this.state;
    if (playing) {
      if (
        prevState.playing &&
        prevState.frame === frame &&
        prevState.game === game
      ) {
        return;
      }
      clearTimeout(this.timer);
      this.timer = setTimeout(this._setNextFrameState, Math.round(1000 / fps));
    } else if (
      prevState.game !== game ||
      prevState.frame !== frame ||
      prevState.ball !== ball ||
      prevState.home !== home ||
      prevState.away !== away
    ) {
      this.setState({ game: this._updateGame(game, frame, ball, home, away) });
    }
  }

  _moveItem = (stateKey, id, x, y, isRel) => {
    const currentState = this.state[stateKey];
    if (id) {
      this.setState({
        [stateKey]: produce(currentState, draft => {
          draft[id] = {
            x: isRel ? x + currentState[id].x : x,
            y: isRel ? y + currentState[id].y : y
          };
        })
      });
    } else {
      this.setState({
        [stateKey]: produce(currentState, draft => {
          draft.x = isRel ? x + currentState.x : x;
          draft.y = isRel ? y + currentState.y : y;
        })
      });
    }
  };

  _stopMoveSelectedItem = e => {
    const selected = this.state.selected;
    if (selected && ARROW_KEYCODES.includes(e.keyCode)) {
      selected[e.keyCode] = 0;
    }
  };

  _moveSelectedItem = e => {
    const selected = this.state.selected;
    if (e.keyCode === 32) {
      return this._playPause();
    }
    if (selected) {
      if (ARROW_KEYCODES.includes(e.keyCode)) {
        selected[e.keyCode] = 1;
      }
      const x = selected[39] ? 1 : selected[37] ? -1 : 0;
      const y = selected[40] ? 1 : selected[38] ? -1 : 0;
      this._moveItem(selected.stateKey, selected.id, x, y, true);
    }
  };

  _toggleSelectItem = (stateKey, id) => {
    const selected = this._isSelected(stateKey, id) ? null : { stateKey, id };
    this.setState({ selected });
  };

  _isSelected(stateKey, id) {
    const { selected } = this.state || {};
    return (
      selected &&
      selected.stateKey === stateKey &&
      (selected.id ? selected.id === id : true)
    );
  }

  _renderPlayers(stateKey, players) {
    return id => {
      const player = players[id];
      return (
        <Player
          isSelected={this._isSelected(stateKey, id)}
          player={player}
          team={stateKey}
          key={stateKey + id}
          id={id}
          onClick={this._toggleSelectItem}
        />
      );
    };
  }

  _setGame = value => {
    try {
      const game = JSON.parse(value);
      clearTimeout(this.timer);
      this.setState({
        playing: false,
        selected: null,
        showImport: null,
        ...this._getFrameStateForGame(0, game)
      });
    } catch (err) {
      console.log("error setting game", err);
      if (this.state.game) {
        this.setState({ showImport: null });
      }
    }
  };

  _updateFps = e => {
    this.setState({ fps: sanitiseNumber(e.target.value) });
  };

  _updateFrame = e => {
    try {
      this.setState(this._getFrameState(sanitiseNumber(e.target.value)));
    } catch (err) {}
  };

  _import = () => {
    this.setState({ showImport: "" });
  };

  _exportGame = () => {
    this.setState({ showImport: JSON.stringify(this.state.game) });
  };

  _renderField() {
    const { ball, home, away, game } = this.state;
    if (!game) {
      return null;
    }
    return (
      <Field
        width={this.state.width}
        height={this.state.height}
        onMoveItem={this._moveItem}
        onKeyDown={this._moveSelectedItem}
        onKeyUp={this._stopMoveSelectedItem}
      >
        {ball ? (
          <Ball
            x={ball.x}
            y={ball.y}
            isSelected={this._isSelected("ball")}
            onClick={this._toggleSelectItem}
          />
        ) : null}
        {Object.keys(home).map(this._renderPlayers("home", home))}
        {Object.keys(away).map(this._renderPlayers("away", away))}
      </Field>
    );
  }

  _renderTools() {
    const { game, frame, playing, fps } = this.state;
    if (!game) {
      return null;
    }
    return (
      <Fragment>
        Frame: <input value={frame} onChange={this._updateFrame} /> FPS:{" "}
        <input value={fps} onChange={this._updateFps} />
        <button onClick={this._playPause}>{playing ? "Pause" : "Play"}</button>
        <button onClick={this._import}>Import Game</button>
        <button onClick={this._exportGame}>Export Game</button>
      </Fragment>
    );
  }

  render() {
    const { showImport } = this.state;
    return (
      <div className="App">
        <div className="App-toolbar">{this._renderTools()}</div>
        {this._renderField()}
        <div className="App-instructions">
          Click to select an item (ball, player), then use the arrow keys to
          move them. Space bar pause / play.
        </div>
        <ImportModal show={showImport} onImport={this._setGame} />
      </div>
    );
  }
}
