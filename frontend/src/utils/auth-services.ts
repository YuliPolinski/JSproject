import {HttpUtils} from "./http-utils";
import {HttpResponseType} from "../types/http-response.type";
import {LoginResponseType} from "../types/login-response.type";
import {SignupRequestType} from "../types/signup-request.type";
import {LoginRequestType} from "../types/login-request.type";
import {LogoutRequestType} from "../types/logout-request.type";

export class AuthServices {

    public static async login(data: LoginRequestType): Promise<LoginResponseType> {
        const result: HttpResponseType = await HttpUtils.request('/login', 'POST', false, data);

        console.log("Ответ от сервера:", result);

        // if (result.error || !result.response ||
        //     !result.response.tokens || !result.response.user ||
        //     !result.response.tokens.accessToken || !result.response.tokens.refreshToken ||
        //     !result.response.user.id || !result.response.user.name) {
        //     throw new Error("Некорректный ответ от сервера");
        // }

        if (result.error || !result.response || typeof result.response !== 'object' ||
            !('tokens' in result.response) || !('user' in result.response)) {

            const message = (result.response as any)?.message || "Некорректный ответ от сервера";
            throw new Error(message);
        }

        return result.response;
    }


    public static async signup(data: SignupRequestType): Promise<LoginResponseType | false> {
        const result: HttpResponseType<{ user: { id: number; name: string; lastName: string } }> = await HttpUtils.request('/signup', 'POST', false, data);
        console.log("Ответ от сервера (signup):", result);

        if (result.error || !result.response || !result.response.user ||
            !result.response.user.id || !result.response.user.name || !result.response.user.lastName) {
            console.error("Некорректный ответ от сервера", result);
            return false;
        }

        const loginResult: LoginResponseType = await AuthServices.login({
            email: data.email,
            password: data.password
        });

        if (!loginResult) {
            console.error("Ошибка автоматического входа после регистрации");
            return false;
        }

        return loginResult;
    }

    public static async logout(data: LogoutRequestType): Promise<void> {
        await HttpUtils.request('/logout', 'POST', false, data);
    }
}