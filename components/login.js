import React, {Component, PropTypes} from 'react';
import {
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import {login} from '../apis/auth';
export default class Login extends Component {
  // static propTypes = {
  //   onLoggedIn: PropTypes.func.isRequired,
  // };

  state = {
    name: undefined,
    user: undefined, // not logged in yet
  };

  onChangeText = text => {
    this.setState({name: text});
  };

  loginHandler = () => {
    const name = this.state.name;
    this.loginUser(name);
  };

  loginUser = async name => {
    try {
      console.log('API CALL', name);
      const response = await login({name: name});
      if (response.status === 200) {
        // this.setState({user: response.data});
        this.props.navigation.navigate('List', {
          user: response.data,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  //Set up linking

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          value={this.state.name}
          onChangeText={this.onChangeText}></TextInput>
        <TouchableOpacity onPress={this.loginHandler}>
          <Text>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const iconStyles = {
  borderRadius: 10,
  iconStyle: {paddingVertical: 5},
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    margin: 20,
  },
  avatarImage: {
    borderRadius: 50,
    height: 100,
    width: 100,
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  text: {
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
  },
  buttons: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    margin: 20,
    marginBottom: 30,
  },
});
