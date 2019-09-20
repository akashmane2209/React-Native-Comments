import React, {Component} from 'react';
import Login from './components/login';
import Comments from './components/Comment/list';

export default class App extends Component {
  state = {
    user: {
      name: 'Akash',
      _id:"5d847ff76982c5104fc6fa79"
    }, // not logged in yet
  };

  // Gets called after user logs in with Facebook or Google
  onLoggedIn = user => {
    this.setState({user});
  };

  render() {
    const {user} = this.state;
    return user ? (
      // Show comments if user is logged in
      <Comments user={user} />
    ) : (
      // Show login screen otherwise
      <Login onLoggedIn={user => this.onLoggedIn(user)} />
    );
  }
}
