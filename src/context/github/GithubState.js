import React, {useReducer} from 'react';
import axios from 'axios';
import GithubContext from './githubContext';
import GithubReducer from './githubReducer';
import {
  CLEAR_USERS,
  GET_REPOS,
  GET_USER,
  SEARCH_USERS,
  SET_LOADING,
} from '../types';

let githubClientId;
let githubClientSecret;

if (process.env.NODE_ENV !== 'production') {
  githubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
  githubClientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
} else {
  githubClientId = process.env.GITHUB_CLIENT_ID;
  githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
}

const GithubState = props => {
      const initialState = {
        users: [],
        user: {},
        repos: [],
        loading: false,
      };

      const [state, dispatch] = useReducer(GithubReducer, initialState);

      // Search Users
      const searchUsers = async text => {
        setLoading();

        const res = await axios.get(
            `https://api.github.com/search/users?q=${text}&client_id=${githubClientId}&client_secret=${githubClientSecret}`,
        );

        dispatch({
          type: SEARCH_USERS,
          payload: res.data.items,
        });
      };

      // Get User
      const getUser = async username => {
        setLoading();

        const res = await axios.get(
            `https://api.github.com/users/${username}?client_id=${githubClientId}&client_secret=${githubClientSecret}`,
        );

        dispatch({
          type: GET_USER,
          payload: res.data,
        });
      };

      // Get Repos
      const getUserRepos = async username => {
        setLoading();

        const res = await axios.get(
            `https://api.github.com/users/${username}/repos?&client_id=${githubClientId}&client_secret=${githubClientSecret}`);
        res.data.sort(function(a, b) {
          return new Date(b.updated_at) - new Date(a.updated_at);
        });

        dispatch({
          type: GET_REPOS,
          payload: res.data.slice(0, 5),
        });
      };

// Clear Users
      const clearUsers = () => dispatch({type: CLEAR_USERS});

// Set Loading
      const setLoading = () => dispatch({type: SET_LOADING});

      return (
          <GithubContext.Provider
              value={{
                users: state.users,
                user: state.user,
                repos: state.repos,
                loading: state.loading,
                searchUsers,
                clearUsers,
                getUser,
                getUserRepos,
              }}
          >
            {props.children}
          </GithubContext.Provider>
      );
    }
;

export default GithubState;