import api from './api';

interface SignUpParams {
  username: string;
  password: string;
}

export const signUp = async ({ username, password }: SignUpParams) => {
  const inviteCode = 'bolsonaro13lula22';
  try {
    const response = await api.post('/signup', {
      username,
      password,
      invite_code: inviteCode,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default { signUp };