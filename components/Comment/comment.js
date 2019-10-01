import React, {PureComponent} from 'react';
import {TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import moment from 'moment';
import io from 'socket.io-client';

import {addReply, getReplies, getLikes, changeLike} from '../../apis/comment';

export default class Comment extends PureComponent {
  state = {
    reply: false,
    replies: [],
    likes: [],
    likeCount: 0,
    liked: false,
  };

  async componentDidMount() {
    this.getLikes();
    this.socket = io('http://192.168.0.120:3000');
    const comment_id = this.props.comment._id;
    this.socket.on(`${comment_id}like`, message => {
      if (message == 'Add') {
        this.setState({likeCount: this.state.likeCount + 1});
      } else {
        this.setState({likeCount: this.state.likeCount - 1});
      }
    });
  }

  getLikes = async () => {
    try {
      const response = await getLikes(this.props.comment._id);
      console.log(response.data);

      const user_id = this.props.user._id;
      const index = response.data.likes.findIndex(like => like === user_id);
      console.log(index);
      if (index !== -1) {
        this.setState({liked: true});
      }
      this.setState({
        likes: response.data.likes,
        likeCount: response.data.count,
      });
    } catch (e) {
      console.log(e.message);
    }
  };

  changeLike = async () => {
    try {
      console.log(this.props);
      const userid = this.props.user._id;
      const comment_id = this.props.comment._id;
      const response = await changeLike({userid: userid}, comment_id);
      console.log(response);
      this.setState({liked: !this.state.liked});
      this.socket.emit('like', {
        message: response.data.message,
        id: comment_id,
      });
    } catch (e) {
      console.log(e);
    }
  };

  replyHandler = event => {
    this.props.navigation.navigate('Reply', {
      comment: this.props.comment,
      user: this.props.user,
    });
    console.log(this.state.reply);
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
            <Text>{this.state.likeCount}</Text>
            <TouchableOpacity
              style={[styles.actionContent]}
              onPress={this.changeLike}>
              <Text
                style={[
                  styles.likeText,
                  !this.state.liked ? styles.inactive : [],
                ]}>
                Like
              </Text>
            </TouchableOpacity>
            {this.props.type === 'reply' ? null : (
              <TouchableOpacity
                style={styles.actionContent}
                onPress={this.replyHandler}>
                <Text>View Replies</Text>
              </TouchableOpacity>
            )}
          </View>
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
    paddingLeft: 25,
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
  inactive: {
    color: '#000',
  },
  likeText: {
    color: '#3F51B5',
    fontWeight: 'bold',
    fontFamily: 'Avenir',
    textAlign: 'center',
    fontSize: 15,
  },
});
