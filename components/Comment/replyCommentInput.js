import React, {Component, PropTypes} from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

export default class ReplyInput extends Component {
  // static propTypes = {
  //   onSubmit: PropTypes.func.isRequired,
  // };

  state = {
    replyText: undefined,
  };

  onSubmitEditing = ({nativeEvent: {text}}) =>
    this.setState({replyText: text}, this.submit);

  submit = () => {
    const {replyText} = this.state;
    console.log(replyText);
    if (replyText) {
      this.setState({replyText: undefined}, () =>
        this.props.onSubmit(replyText),
      );
    } else {
      alert('Please enter your comment first');
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          placeholder="Add a reply"
          keyboardType="twitter"
          style={styles.input}
          value={this.state.replyText}
          onChangeText={text => this.setState({replyText: text})}
          onSubmitEditing={this.onSubmitEditing}
        />
        <TouchableOpacity style={styles.button} onPress={this.submit}>
          <Text
            style={[styles.text, !this.state.replyText ? styles.inactive : []]}>
            Post
          </Text>
        </TouchableOpacity>
      </View>
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
    height: 50,
  },
  input: {
    flex: 1,
    height: 38,
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
