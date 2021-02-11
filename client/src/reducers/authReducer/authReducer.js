import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  LOGOUT,
} from '../../actions/types';

const initialState = {
  token: localStorage.getItem('jwt'),
  isAuthenticated: false,
};

const authReducer = (state = initialState, action) => {
  const { type, data } = action;
  switch (type) {
    case REGISTER_SUCCESS:
      localStorage.setItem('jwt', data.token);
      return {
        token: data.token,
        isAuthenticated: true,
      };
    case REGISTER_FAIL:
      localStorage.removeItem('jwt');
      return {
        token: null,
        isAuthenticated: false,
      };
    case LOGIN_SUCCESS:
      localStorage.setItem('jwt', data.token);
      return {
        token: data.token,
        isAuthenticated: true,
      };
    case LOGOUT:
      localStorage.removeItem('jwt');
      return {
        token: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

export default authReducer;
