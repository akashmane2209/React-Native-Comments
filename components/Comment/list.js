import React, {Component, PropTypes} from 'react';
import {RefreshControl, ScrollView, StyleSheet, View} from 'react-native';
import io from 'socket.io-client';

import {getComments, addComment} from '../../apis/comment';

import Comment from './comment';
import Input from './input';

export default class List extends Component {
  state = {
    comments: [],
    refreshing: true,
  };

  componentDidMount = () => {
    this.fetchComments();
    this.socket = io('http://192.168.0.120:3000');
    this.socket.on('add comment', comment => {
      this.fetchComments();
    });
  };

  onRefresh = () => {
    this.fetchComments();
  };

  fetchComments = async () => {
    this.setState({refreshing: true});
    try {
      const response = await getComments();
      const comments = response.data.comments;
      this.setState({comments, refreshing: false});
    } catch (error) {
      alert(error);
    }
  };

  submitComment = async comment => {
    const {user} = this.props;
    const content = comment;
    this._scrollView.scrollTo({y: 0});
    try {
      const response = await addComment({user_id: user._id, content: content});
      const comment = response.data.comment;
      this.socket.emit('add comment', comment);
    } catch (error) {
      alert(error);
    }
  };

  render() {
    const {comments} = this.state;
    return (
      <View style={styles.container}>
        {/* Scrollable list */}
        <View
          style={{
            paddingBottom: 10,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: '#d6d7da',
          }}>
          <Input onSubmit={this.submitComment} />
        </View>

        <ScrollView
          ref={scrollView => {
            this._scrollView = scrollView;
          }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }>
          {/* Render each comment with Comment component */}
          {comments.map((comment, index) => (
            <Comment comment={comment} key={index} user={this.props.user} />
          ))}
        </ScrollView>
        {/* Comment input box */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 20,
  },
});
