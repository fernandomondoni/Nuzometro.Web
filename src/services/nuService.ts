import api from "./api";

export const registerNu = async (payload: {
  username: string;
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

export const getNu = async (username: string): Promise<Response> => {
  const token = localStorage.getItem("id_token");
  const response = await api.get(`/nu?username=${username}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getLocations = async (): Promise<{ items: string[] }> => {
  const token = localStorage.getItem("id_token");
  const response = await api.get(`/location`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const addLocation = async (
  location: string,
  eventDate: string
): Promise<Response> => {
  const token = localStorage.getItem("id_token");
  const response = await api.put(
    `/location`,
    { location, max_date: eventDate },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
