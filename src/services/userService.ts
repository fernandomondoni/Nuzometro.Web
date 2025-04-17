import api from './api';

interface SignUpParams {
  username: string;
  password: string;
  inviteCode?: string;
}

export const signUp = async ({ username, password, inviteCode }: SignUpParams) => {
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