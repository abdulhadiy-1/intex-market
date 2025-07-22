import axios from "axios";
import { API } from "../hooks/getEnv";

const getRequest = (url: string, token?: string) => {
  const config = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};

  return axios.get(`${API}${url}`, config);
};

export default getRequest;
