import React, {Component} from 'react';
import Login from './components/login';
import Comments from './components/Comment/list';
import Comment from './components/Comment/comment';
import Reply from './components/Comment/replyComment';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

const AppNavigator = createStackNavigator(
  {
    Login: {
      screen: Login,
    },
    List: {
      screen: Comments,
    },
    Comment: {
      screen: Comment,
    },
    Reply: {
      screen: Reply,
    },
  },
  {
    initialRouteName: 'Login',
  },
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends Component {
  render() {
    return <AppContainer />;
  }
}
