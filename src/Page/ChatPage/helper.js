import axios from 'axios';
export const instance = axios.create({
    baseURL: 'https://ai-care-be.onrender.com',
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
