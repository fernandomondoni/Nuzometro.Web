import api from "./api";

export const registerNu = async (payload: {
  user: string;
  location: string;
  date: string;
}): Promise<Response> => {
  const token = localStorage.getItem("id_token");
  console.log("token:", token);
  const response = await api.patch(`/nu`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getNu = async (user: string): Promise<Response> => {
  const token = localStorage.getItem("id_token");
  const response = await api.get(`/nu?user=${user}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
