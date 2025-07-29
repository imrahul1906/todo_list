import axios, { Axios } from "axios";
import dotenv from "dotenv";
dotenv.config();
const BASE_URL = process.env.BASE_API_URL || `http://127.0.0.1:${process.env.PORT || 3000}`;
import { createTodo, registerUser, loginUser, deleteTodo, refreshToken, logout } from "./config/RequestConfig.js";
import { saveToken, loadToken, saveRefreshToken, loadRefreshToken, clearToken } from "./config/TokenStorage.js";
export class AxiosClient {

    async loginUser(data) {
        const config = loginUser(BASE_URL, 'api/login', data);
        const resData = await this.makeRequest(config);

        if (resData && resData.data) {
            saveToken(resData.data.token);
            saveRefreshToken(resData.data.refreshToken);
        }
    }

    async registerUser(data) {
        const config = registerUser(BASE_URL, 'api/register', data);
        await this.makeRequest(config);
    }

    async logout() {
        const refreshToken = loadRefreshToken();
        const data = {
            token: refreshToken
        }
        const config = logout(BASE_URL, 'api/logout', data);
        await this.makeRequest(config);
        clearToken();
    }

    async deleteTodoTask(id) {
        const token = loadToken();
        const headers = {
            authorization: `Bearer ${token}`
        }
        const config = deleteTodo(BASE_URL, 'api/todo', id, headers);
        await this.makeRequest(config);
    }

    async createTodo(data) {
        const token = loadToken();
        const headers = {
            authorization: `Bearer ${token}`
        }
        const config = createTodo(BASE_URL, 'api/todo', data, headers);
        await this.makeRequest(config);
    }

    async attemptRefresh() {
        const token = loadRefreshToken();
        const data = {
            token
        }
        const config = refreshToken(BASE_URL, 'api/refresh', data);
        const response = await axios(config);
        saveToken(response.data.data.token);
        return response.data;
    }

    async makeRequest(config) {
        try {
            const response = await axios(config);
            console.log(response.data);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status == 401 &&
                config.headers && config.headers.authorization) {
                console.error("Access token might be expired. Attempting refresh …");

                const res = await this.attemptRefresh();
                if (!res) {
                    return null;
                }

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
                return null;
            }
        }
    }
}