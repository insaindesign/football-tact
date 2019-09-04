const positions = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"];

const fillPositions = () => {
  const obj = {};
  positions.forEach(pos => (obj[pos] = null));
  return obj;
};

const nextEmptyPosition = obj => {
  for (var ii = 0; ii < positions.length; ii++) {
    if (!obj[positions[ii]]) {
      return positions[ii];
    }
  }
};

const convertToGame = (positions, players) => {
  const game = {};
  positions.forEach(pos => {
    if (!game[pos.frame]) {
      game[pos.frame] = {
        home: fillPositions(),
        away: fillPositions(),
        ball: null
      };
    }
    const frame = game[pos.frame];
    const position = { x: pos.x, y: pos.y };
    if (pos.player === 0) {
      return (frame.ball = position);
    }
    const playerInfo = players[pos.player];
    if (playerInfo) {
      if (playerInfo.team === "attack") {
        const homeId = nextEmptyPosition(frame.home);
        return (frame.home[homeId] = position);
      }
      const awayId = nextEmptyPosition(frame.away);
      return (frame.away[awayId] = position);
    }
  });
  return game;
};

export default function(positions, players) {
  return JSON.stringify(convertToGame(positions, players));
}
