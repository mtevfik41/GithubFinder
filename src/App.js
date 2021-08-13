import React, {Component, Fragment} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Users from './components/users/Users';
import User from './components/users/User';
import Search from './components/users/Search';
import Alert from './components/layout/Alert';
import About from './components/pages/About';
import axios from 'axios';
import './App.css';

let githubClientId;
let githubClientSecret;
if (process.env.NODE_ENV !== 'production') {
  githubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
  githubClientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
} else {
  githubClientId = process.env.GITHUB_CLIENT_ID;
  githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
}

class App extends Component {
  state = {
    users: [],
    user: {},
    repos: [],
    loading: false,
    alert: null,
  };

  /*  async componentDidMount() {
      this.setState({loading: true});
      const res = await axios.get(
          `https://api.github.com/users?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
      this.setState({users: res.data, loading: false});
    }*/

  searchUsers = async text => {
    this.setState({loading: true});
    const res = await axios.get(
        `https://api.github.com/search/users?q=${text}&client_id=${githubClientId}&client_secret=${githubClientSecret}`,
    );
    this.setState({users: res.data.items, loading: false});
  };
  getUser = async (username) => {
    this.setState({loading: true});
    const res = await axios.get(
        `https://api.github.com/users/${username}?&client_id=${githubClientId}&client_secret=${githubClientSecret}`,
    );
    this.setState({user: res.data, loading: false});
  };
  getUserRepos = async (username) => {
    this.setState({loading: true});
    const res = await axios.get(
        `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${githubClientId}&client_secret=${githubClientSecret}`,
    );
    this.setState({repos: res.data, loading: false});
  };
  clearUsers = () => {
    this.setState({users: [], loading: false});
  };
  setAlert = (message, type) => {
    this.setState({alert: {msg: message, type: type}});

    setTimeout(() => this.setState({alert: null}), 3000);
  };

  render() {
    const {users, user, repos, loading} = this.state;

    return (
        <Router>

          <Fragment>
            <Navbar/>
            <div className="container">
              <Alert alert={this.state.alert}/>
              <Switch>
                <Route exact path="/" render={props => (
                    <Fragment>
                      <Search searchUsers={this.searchUsers}
                              clearUsers={this.clearUsers}
                              showClear={users.length > 0}
                              setAlert={this.setAlert}/>
                      <Users users={users} loading={loading}/>
                    </Fragment>
                )}/>
                <Route exact path="/about" component={About}/>
                <Route exact path="/user/:login" render={props => (
                    <User {...props} getUser={this.getUser}
                          getUserRepos={this.getUserRepos} user={user}
                          repos={repos}
                          loading={loading}/>
                )}/>
              </Switch>
            </div>
          </Fragment>
        </Router>
    );
  }
}

export default App;
