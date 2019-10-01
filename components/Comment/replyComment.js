import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import moment from 'moment';
import Input from './replyCommentInput';
import Comment from './comment';
import {addReply, getReplies, getLikes, changeLike} from '../../apis/comment';
import io from 'socket.io-client';

export default class ReplyComment extends Component {
  state = {
    reply: false,
    replies: [],
    likes: [],
    likeCount: 0,
    liked: false,
  };

  async componentDidMount() {
    this.getReplies();
    this.socket = io('http://192.168.0.120:3000');
    const {navigation} = this.props;
    const comment = navigation.getParam('comment');
    const comment_id = comment._id;
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
      const {navigation} = this.props;
      const comment = navigation.getParam('comment');
      const response = await getLikes(comment._id);
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
      const response = await changeLike({userid: user._id}, comment._id);
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

  getReplies = async () => {
    try {
      const {navigation} = this.props;
      const comment = navigation.getParam('comment');
      const response = await getReplies(comment._id);
      this.setState({replies: response.data.replies});
      this.setState({reply: true});
    } catch (e) {
      alert('Failed to get replies');
      console.log(e.message);
    }
  };

  addReplyHandler = async text => {
    try {
      const {navigation} = this.props;
      const comment = navigation.getParam('comment');
      const comment_id = comment._id;
      console.log(comment_id);
      const user_id = comment.user._id;
      console.log(user_id);
      const content = text;
      const response = await addReply({comment_id, user_id, content});
      this.getReplies();
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const {navigation} = this.props;
    const comment = navigation.getParam('comment');
    const userObj = navigation.getParam('user');
    // Pull data needed to display a comment out of comment object
    const {content, created, user} = comment;
    // Pull user name and avatar out of user object
    const {name} = user;
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        enabled
        keyboardVerticalOffset={Platform.select({
          ios: () => 0,
          android: () => -200,
        })()}>
        <View style={styles.replyContainer}>
          <View style={styles.contentContainer}>
            <Text>
              <Text style={[styles.text, styles.name]}>{name}</Text>{' '}
              <Text style={styles.text}>{content}</Text>
            </Text>
            <Text style={[styles.text, styles.created]}>
              {moment(created).fromNow()}
            </Text>
          </View>
        </View>

        <ScrollView style={styles.replies}>
          {this.state.reply ? (
            this.state.replies.length > 0 ? (
              this.state.replies.map(reply => {
                return (
                  <Comment
                    key={reply._id}
                    comment={reply}
                    user={userObj}
                    type="reply"
                  />
                );
              })
            ) : (
              <Text>No comments to display</Text>
            )
          ) : null}
          <View style={{height: 60}} />
        </ScrollView>
        <View style={styles.bottom}>
          <Input style={styles.input} onSubmit={this.addReplyHandler} />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  replyContainer: {
    flexDirection: 'row',
  },
  contentContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#EEE',
    paddingLeft: 25,
    height: 75,
    // alignItems: 'center',
    justifyContent: 'center'
  },
  replies: {
    marginLeft: 25,
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
  input: {
    position: 'absolute',
    bottom: 0,
    height: 150,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36,
  },
});
