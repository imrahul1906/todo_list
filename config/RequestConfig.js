const loginUser = (baseUrl, path, data) => {
    const url = `${baseUrl}/${path}`;
    return {
        method: 'post',
        url,
        data
    }
}

const logout = (baseUrl, path, data) => {
    const url = `${baseUrl}/${path}`;
    return {
        method: 'post',
        url,
        data
    }
}

const registerUser = (baseUrl, path, data) => {
    const url = `${baseUrl}/${path}`;
    return {
        method: 'post',
        url,
        data
    }
}

const createTodo = (baseUrl, path, data, header) => {
    const url = `${baseUrl}/${path}`;
    return {
        method: 'post',
        url,
        data,
        headers: {
            'Content-Type': "application/json",
            ...header
        },
    }
}

const getTodos = (baseUrl, path, header, page, limit) => {
    const url = `${baseUrl}/${path}?page=${page}&limit=${limit}`;
    return {
        method: 'get',
        url,
        headers: {
            'Content-Type': "application/json",
            ...header
        },
    };
}

const deleteTodo = (baseUrl, path, id, header) => {
    const url = `${baseUrl}/${path}/${id}`;
    return {
        method: 'delete',
        url,
        headers: {
            'Content-Type': "application/json",
            ...header
        },
    }
}

const refreshToken = (baseUrl, path, data) => {
    const url = `${baseUrl}/${path}`;
    return {
        method: 'post',
        url,
        data,
    }
}

export { createTodo, registerUser, loginUser, logout, deleteTodo, refreshToken, getTodos }