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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUtils = void 0;
const config_1 = __importDefault(require("../config/config"));
class AuthUtils {
    static setAuthInfo(accessToken, refreshToken, userInfo = null) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        if (userInfo) {
            localStorage.setItem(this.userInfoTokenKey, JSON.stringify(userInfo));
        }
    }
    static removeAuthInfo() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoTokenKey);
    }
    static getAuthInfo(key = null) {
        var _a, _b;
        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoTokenKey].includes(key)) {
            return localStorage.getItem(key);
        }
        else {
            return {
                accessToken: (_a = localStorage.getItem(this.accessTokenKey)) !== null && _a !== void 0 ? _a : '',
                refreshToken: (_b = localStorage.getItem(this.refreshTokenKey)) !== null && _b !== void 0 ? _b : '',
                userInfo: JSON.parse(localStorage.getItem(this.userInfoTokenKey) || 'null'),
            };
        }
    }
    static updateRefreshToken() {
        return __awaiter(this, void 0, void 0, function* () {
            let result = false;
            const refreshToken = AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey);
            if (refreshToken) {
                const response = yield fetch(config_1.default.api + '/refresh', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({ refreshToken: refreshToken }),
                });
                if (response && response.status === 200) {
                    const tokens = yield response.json();
                    if (tokens && !tokens.error && tokens.accessToken && tokens.refreshToken) {
                        AuthUtils.setAuthInfo(tokens.accessToken, tokens.refreshToken);
                        result = true;
                    }
                }
            }
            if (!result) {
                AuthUtils.removeAuthInfo();
            }
            return result;
        });
    }
}
exports.AuthUtils = AuthUtils;
AuthUtils.accessTokenKey = 'accessToken';
AuthUtils.refreshTokenKey = 'refreshToken';
AuthUtils.userInfoTokenKey = 'userInfo';
