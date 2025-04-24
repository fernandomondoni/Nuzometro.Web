import api from "./api";

interface LoginParams {
  username: string;
  password: string;
}

export const login = async (data: LoginParams) => {
  const response = await api.post("/login", data);
  const { tokens, username } = response.data;

  localStorage.setItem("access_token", tokens.access_token);
  localStorage.setItem("id_token", tokens.id_token);
  localStorage.setItem("refresh_token", tokens.refresh_token);
  localStorage.setItem("username", username);

  return response.data;
};

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await api.post("/refresh", {
      refresh_token: refreshToken,
    });
    const { access_token } = response.data.tokens;

    localStorage.setItem("access_token", access_token);

    return access_token;
  } catch (error) {
    console.error("Error refreshing token", error);
    throw error;
  }
};
