import React, {Component, Fragment} from 'react';
import Navbar from './components/layout/Navbar';
import Users from './components/users/Users';
import axios from 'axios';
import './App.css';

class App extends Component {
  state = {
    users: [],
    loading: false,
  };

  async componentDidMount() {
    this.setState({loading: true});
    const res = await axios.get(
        `https://api.github.com/users?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
    this.setState({users: res.data, loading: false});
  }

  render() {
    return (
        <Fragment>
          <Navbar/>
          <div className="container">
            <Users users={this.state.users} loading={this.state.loading}/>
          </div>
        </Fragment>
    );
  }
}

export default App;
