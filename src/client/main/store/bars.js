import { SET_BARS, SET_BAR_COUNT, CLEAR_GOING, SET_GOING } from './constants';

let initialState = [];

export default function bars (state = initialState, action) {
  switch (action.type) {
    case SET_BARS:
      return action.bars.slice ();

    case SET_BAR_COUNT:
      console.log ('SET_BAR_COUNT', action.id, action.count, action.going);
      let bars = state.map (bar => {
        if (bar.id === action.id) {
          return Object.assign (bar, {count: action.count, going: action.going});
        } else {
          return bar;
        }
      });
      return bars;

    case CLEAR_GOING: {
      let bars = state.map (bar => {
        return Object.assign (bar, {going: false});
      });
      return (bars);
    }
    case SET_GOING: {
      let bars = state.map (bar => {
        let going = (action.list.indexOf (bar.id) !== -1);
        return Object.assign (bar, {going: going});
      });
      return (bars);
    }
    default:
      return state;
  }
}

export function getBar (state, id) {
  for (let bar of state.bars) {
    if (bar.id === id) {
      return bar;
    }
  }
  return null;
}
