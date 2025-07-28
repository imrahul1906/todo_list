import axios, { Axios } from "axios";
import { createTodo, registerUser, loginUser, deleteTodo, refreshToken } from "./config/RequestConfig.js";
import { saveToken, loadToken, saveRefreshToken, loadRefreshToken, clearToken } from "./config/TokenStorage.js";
export class AxiosClient {

    async loginUser(data) {
        const config = loginUser('http://127.0.0.1:3000', 'login', data);
        const resData = await this.makeRequest(config);

        if (resData && resData.data) {
            saveToken(resData.data.token);
            saveRefreshToken(resData.data.refreshToken);
        }
    }

    async registerUser(data) {
        const config = registerUser('http://127.0.0.1:3000', 'register', data);
        await this.makeRequest(config);
    }

    async logout() {
        clearToken();
    }

    async deleteTodoTask(id) {
        const token = loadToken();
        const headers = {
            authorization: `Bearer ${token}`
        }
        const config = deleteTodo('http://127.0.0.1:3000', 'todo', id, headers);
        await this.makeRequest(config);
    }

    async createTodo(data) {
        const token = loadToken();
        const headers = {
            authorization: `Bearer ${token}`
        }
        const config = createTodo('http://127.0.0.1:3000', 'todo', data, headers);
        await this.makeRequest(config);
    }

    async attemptRefresh() {
        const token = loadRefreshToken();
        const data = {
            token
        }
        const config = refreshToken('http://127.0.0.1:3000', 'refresh', data);
        try {
            const response = await axios(config);
            saveToken(response.data.data.token);
            return response.data;
        } catch (error) {
            console.error("Refresh Request failed:", error.message);
        }
    }

    async makeRequest(config) {
        try {
            const response = await axios(config);
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error("Request failed:", error.message);
            if (error.response && error.response.status == 401) {
                console.error("Refreshing token to login again.");
                const res = await this.attemptRefresh();
                if (!res) {
                    console.log("refresh request failed");
                    return null;
                }

                // retry the operation
                const token = loadToken();
                config.headers.authorization = `Bearer ${token}`;
                const retryResponse = await axios(config);
                console.log(retryResponse.data);
                return retryResponse.data;

            } else {
                if (error.response) {
                    console.error("Server responded with:", error.response.data);
                } else {
                    console.error("No response received. Is the server running?");
                }
                return null; // Return null for non-401 errors
            }
        }
    }
}