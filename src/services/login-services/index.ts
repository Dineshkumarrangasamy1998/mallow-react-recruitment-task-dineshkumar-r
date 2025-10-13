import { LoginPayload } from "../../model/Login";
import Constants from "../../utils/constants";
import Endpoints from "../../utils/endpoints";
import axiosInstance from "../interceptors";

//API call with promise handle & error handling
const handleLogin = (loginData: LoginPayload): Promise<string> => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post(Endpoints.login, loginData)
      .then((response) => {
        const token = response?.data?.token;
        if (token) {
          localStorage.setItem(Constants.TOKEN_KEY, token);
          localStorage.setItem("user", JSON.stringify(loginData.username));
          resolve(token);
        } else {
          reject(new Error("Login succeeded but no token returned"));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//create new user API call
const createUser = (payload: {
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
}): Promise<any> => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post(Endpoints.users, { data: payload })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//logout api call
const logout = (): void => {
  axiosInstance
    .post(Endpoints.logout)
    .then(() => {
      localStorage.removeItem(Constants.TOKEN_KEY);
      window.location.href = "https://dineshkumarrangasamy1998.github.io/mallow_react_task_dineshkumar/";
    })
    .catch((error) => {
      console.error("Logout failed:", error);
    });
};

export { handleLogin, createUser, logout };
