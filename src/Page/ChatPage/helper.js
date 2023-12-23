import axios from 'axios';
export const instance = axios.create({
    baseURL: 'http://localhost:8080',
});

export async function getMessageHistory(_id) {
  try {
    const { data } = await instance.post('/api/history', { userID: _id });
    return Promise.resolve({ data });
  } catch (error) {
    console.log(error);
    return Promise.reject({ error: 'Can not get user' });
  }
}
