import React, {PureComponent, PropTypes} from 'react';
import {TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import moment from 'moment';

import {addReply, getReplies} from '../../apis/comment';

export default class ReplyComment extends PureComponent {
  state = {
    reply: false,
    replies: [],
  };

  getReplies = async () => {
    try {
      console.log(this.props.comment._id);
      const response = await getReplies(this.props.comment._id);
      console.log(response.data);
      this.setState({replies: response.data.replies});
      this.setState({reply: true});
    } catch (e) {
      alert('Failed to get replies');
    }
  };

  replyHandler = event => {
    event.preventDefault();
    this.setState({reply: !this.state.reply}, () => {
      if (this.state.reply) {
        this.getReplies();
      }
    });
    console.log(this.state.reply);
  };

  addReplyHandler = async text => {
    try {
      const comment_id = this.props.comment._id;
      const user_id = this.props.comment.user._id;
      const content = text;
      console.log(comment_id, user_id, content);
      const response = await addReply({comment_id, user_id, content});
      this.getReplies();
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    // Pull comment object out of props
    const {comment} = this.props;
    // Pull data needed to display a comment out of comment object
    const {content, created, user} = comment;
    // Pull user name and avatar out of user object
    const {name} = user;
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text>
            <Text style={[styles.text, styles.name]}>{name}</Text>{' '}
            <Text style={styles.text}>{content}</Text>
          </Text>
          <Text style={[styles.text, styles.created]}>
            {moment(created).fromNow()}
          </Text>
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.actionContent}>
              <Text>Like</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionContent}
              onPress={this.replyHandler}>
              <Text>Reply</Text>
            </TouchableOpacity>
          </View>
          {this.state.reply ? (
            <View>
              {this.state.replies.map((reply, index) => (
                <ReplyComment comment={reply} key={index} />
              ))}
            </View>
          ) : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  contentContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#EEE',
    paddingLeft: 10,
  },
  text: {
    color: '#000',
    fontFamily: 'Avenir',
    fontSize: 15,
  },
  name: {
    fontWeight: 'bold',
  },
  created: {
    color: '#BBB',
  },
  actionContainer: {
    flexDirection: 'row',
    padding: 2,
    width: '100%',
  },
  actionContent: {
    padding: 5,
  },
});
