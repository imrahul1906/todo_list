import axios, { Axios } from "axios";
import { createTodo, registerUser, loginUser, deleteTodo } from "./config/RequestConfig.js";
import { saveToken, loadToken, clearToken } from "./config/TokenStorage.js";
export class AxiosClient {

    async loginUser(data) {
        const config = loginUser('http://127.0.0.1:3000', 'login', data);
        const resData = await this.makeRequest(config);
        saveToken(resData.data.token);
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

    async makeRequest(config) {
        try {
            const response = await axios(config);
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error("Request failed:", error.message);
            if (error.response) {
                console.error("Server responded with:", error.response.data);
            } else {
                console.error("No response received. Is the server running?");
            }
        }
    }
}