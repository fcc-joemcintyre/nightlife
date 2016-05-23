import { SET_AUTHENTICATED } from './constants';

let initialState = {
  authenticated: false,
  username: ''
};

export default function user (state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return Object.assign ({}, state, {
        authenticated: action.authenticated,
        username: action.username
      });

    default:
      return state;
  }
}
