import axiosInstance from "../interceptors";
import Endpoints from "../../utils/endpoints";

//delete user API call
const deleteUser = (id: number): Promise<void> => {
  return axiosInstance
    .delete(`${Endpoints.users}/${id}`)
    .then(() => {
      console.log(`User with ID ${id} deleted successfully.`);
      return Promise.resolve();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export { deleteUser };
