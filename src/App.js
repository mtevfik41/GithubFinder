import React, {Component, Fragment} from 'react';
import Navbar from './components/layout/Navbar';
import Users from './components/users/Users';
import Search from './components/users/Search';
import Alert from './components/layout/Alert';
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
    loading: false,
    alert: null
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
  clearUsers = () => {
    this.setState({users: [], loading: false});
  };
  setAlert = (message,type) => {
    this.setState({alert:{msg: message, type: type}})

    setTimeout(() => this.setState({alert:null}),3000)
  }
  render() {
    const {users, loading} = this.state;

    return (
        <Fragment>
          <Navbar/>
          <div className="container">
            <Alert alert={this.state.alert}/>
            <Search searchUsers={this.searchUsers} clearUsers={this.clearUsers}
                    showClear={users.length > 0} setAlert={this.setAlert}/>
            <Users users={users} loading={loading}/>
          </div>
        </Fragment>
    );
  }
}

export default App;
