# football-tact

## Quick start:

All the players

```
[
  {"home":{"a":{},"b":{},"c":{},"d":{},"e":{},"f":{},"g":{},"h":{},"i":{},"j":{},"k":{}},"away":{"a":{},"b":{},"c":{},"d":{},"e":{},"f":{},"g":{},"h":{},"i":{},"j":{},"k":{}},"ball":{}}
]
```

Add another frame

```
{"home":{"a":{},"b":{},"c":{},"d":{},"e":{},"f":{},"g":{},"h":{},"i":{},"j":{},"k":{}},"away":{"a":{},"b":{},"c":{},"d":{},"e":{},"f":{},"g":{},"h":{},"i":{},"j":{},"k":{}},"ball":{}}
```


## Data format

```
[
  {
    ball: { x: 0, y 0 },
    home: {
      a: { x: 0, y 0 },
      b: { x: 0, y 0 },
      ...
      k: { x: 100, y: 100 }
    },
    away: {
      a: { x: 0, y 0 },
      b: { x: 0, y 0 },
      ...
      k: { x: 100, y: 100 }
    }
  }
]
```

Each array item reflects one frame.

Each frame is an object with three keys: "ball", "away" and "home".

* "ball" is a set of coordinates.
* "home" and "away" are objects with a unique ids as keys, and coordinates as values.

The coordinates have two keys (x and y), and the values are percentages using the width and height of the field.

See [Example data files](src/data/), which are derived from the AWESOME and painstaking work from https://github.com/rjtavares/football-crunching.


## How to test this locally

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.


