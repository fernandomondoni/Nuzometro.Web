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
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: any } };
      throw axiosError.response?.data || error;
    }
    throw error;
  }
};

export default { signUp };
