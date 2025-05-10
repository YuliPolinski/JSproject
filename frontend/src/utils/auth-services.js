"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const http_utils_1 = require("./http-utils");
class AuthServices {
    static login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield http_utils_1.HttpUtils.request('/login', 'POST', false, data);
            console.log("Ответ от сервера:", result);
            if (result.error || !result.response ||
                !result.response.tokens || !result.response.user ||
                !result.response.tokens.accessToken || !result.response.tokens.refreshToken ||
                !result.response.user.id || !result.response.user.name) {
                throw new Error("Некорректный ответ от сервера");
            }
            return result.response;
        });
    }
    static signup(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield http_utils_1.HttpUtils.request('/signup', 'POST', false, data);
            console.log("Ответ от сервера (signup):", result);
            if (result.error || !result.response || !result.response.user ||
                !result.response.user.id || !result.response.user.name || !result.response.user.lastName) {
                console.error("Некорректный ответ от сервера", result);
                return false;
            }
            const loginResult = yield AuthServices.login({
                email: data.email,
                password: data.password
            });
            if (!loginResult) {
                console.error("Ошибка автоматического входа после регистрации");
                return false;
            }
            return loginResult;
        });
    }
    static logout(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield http_utils_1.HttpUtils.request('/logout', 'POST', false, data);
        });
    }
}
exports.AuthServices = AuthServices;
