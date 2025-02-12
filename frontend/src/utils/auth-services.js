import {HttpUtils} from "./http-utils.js";

export class AuthServices {

    static async login(data) {
        const result = await HttpUtils.request('/login', 'POST', false, data);

        console.log("Ответ от сервера:", result);

        if (result.error || !result.response ||
            !result.response.tokens || !result.response.user ||
            !result.response.tokens.accessToken || !result.response.tokens.refreshToken ||
            !result.response.user.id || !result.response.user.name) {
            console.error("Некорректный ответ от сервера", result);
            return false;
        }

        return result.response;
    }

    static async signup(data) {
        const result = await HttpUtils.request('/signup', 'POST', false, data);
        console.log("Ответ от сервера (signup):", result);

        if (result.error || !result.response || !result.response.user ||
            !result.response.user.id || !result.response.user.name || !result.response.user.lastName) {
            console.error("Некорректный ответ от сервера", result);
            return false;
        }

        const loginResult = await AuthServices.login({
            email: data.email,
            password: data.password
        });

        if (!loginResult) {
            console.error("Ошибка автоматического входа после регистрации");
            return false;
        }

        return loginResult;
    }

    static async logout(data) {
        await HttpUtils.request('/logout', 'POST', false, data);
    }
}