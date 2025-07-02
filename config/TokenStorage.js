import fs from "fs"

const TOKEN = './.token'
const REFRESHTOKEN = './.refreshToken'
export const saveToken = (token) => {
    fs.writeFileSync(TOKEN, token, "utf-8");
}

export const saveRefreshToken = (token) => {
    fs.writeFileSync(REFRESHTOKEN, token, "utf-8");
}

export const loadToken = () => {
    if (fs.existsSync(TOKEN)) {
        return fs.readFileSync(TOKEN, "utf-8");
    }
    return null;
}

export const loadRefreshToken = () => {
    if (fs.existsSync(REFRESHTOKEN)) {
        return fs.readFileSync(REFRESHTOKEN, "utf-8");
    }
    return null;
}

export const clearToken = () => {
    if (fs.existsSync(TOKEN)) {
        fs.unlinkSync(TOKEN);
    }

    if (fs.existsSync(REFRESHTOKEN)) {
        fs.unlinkSync(REFRESHTOKEN);
    }
}