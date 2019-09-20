import axios from 'axios';
const apiUrl = 'http://192.168.0.120:3000/comments';

export const getComments = async () => {
  console.log('API CALL');
  try {
    const response = await axios.get(apiUrl);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const addComment = async body => {
  console.log(body);
  const response = await axios.post(apiUrl, body);
  return response;
};

export const addReply = async body => {
  const response = await axios.put(apiUrl, body);
  return response;
};

export const getReplies = async comment_id => {
  const response = await axios.get(`${apiUrl}/getReplies?id=${comment_id}`);
  return response;
};
