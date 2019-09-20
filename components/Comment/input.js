import React, {Component, PropTypes} from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

export default class Input extends Component {
  // static propTypes = {
  //   onSubmit: PropTypes.func.isRequired,
  // };

  state = {
    text: undefined,
  };

  onSubmitEditing = ({nativeEvent: {text}}) =>
    this.setState({text}, this.submit);

  submit = () => {
    const {text} = this.state;
    console.log(text);
    if (text) {
      this.setState({text: undefined}, () => this.props.onSubmit(text));
    } else {
      alert('Please enter your comment first');
    }
  };

  render() {
    return (
      <KeyboardAvoidingView behavior="padding">
        <View style={styles.container}>
          <TextInput
            placeholder="Add a comment"
            keyboardType="twitter"
            autoFocus={true}
            style={styles.input}
            value={this.state.text}
            onChangeText={text => this.setState({text: text})}
            onSubmitEditing={this.onSubmitEditing}
          />
          <TouchableOpacity style={styles.button} onPress={this.submit}>
            <Text
              style={[styles.text, !this.state.text ? styles.inactive : []]}>
              Post
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#EEE',
    alignItems: 'center',
    paddingLeft: 15,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 15,
  },
  button: {
    height: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactive: {
    color: '#CCC',
  },
  text: {
    color: '#3F51B5',
    fontWeight: 'bold',
    fontFamily: 'Avenir',
    textAlign: 'center',
    fontSize: 15,
  },
});
