import fs from "fs"

const TOKEN = './.token'
export const saveToken = (token) => {
    fs.writeFileSync(TOKEN, token, "utf-8");
}

export const loadToken = () => {
    if (fs.existsSync(TOKEN)) {
        return fs.readFileSync(TOKEN, "utf-8");
    }
    return null;
}

export const clearToken = () => {
    if (fs.existsSync(TOKEN)) {
        fs.unlinkSync(TOKEN);
    }
}