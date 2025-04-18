import api from "./api";

interface SignUpParams {
  username: string;
  password: string;
  inviteCode?: string;
}

interface AxiosErrorResponse {
  response?: {
    data?: { message: string };
  };
}

export const signUp = async ({
  username,
  password,
  inviteCode,
}: SignUpParams) => {
  try {
    const response = await api.post("/signup", {
      username,
      password,
      invite_code: inviteCode,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error && "response" in error) {
      const axiosError = error as AxiosErrorResponse;
      throw axiosError.response?.data || error;
    }
    throw error;
  }
};

export default { signUp };
