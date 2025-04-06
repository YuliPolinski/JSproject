import config from "../config/config";
import {UserInfoType} from "../types/user-info.type";
import {AuthInfoType} from "../types/auth-info.type";
import {RefreshResponseType} from "../types/refresh-token.type";

export class AuthUtils {
    public static accessTokenKey: string = 'accessToken';
    public static refreshTokenKey: string = 'refreshToken';
    public static userInfoTokenKey: string = 'userInfo';

    public static setAuthInfo(accessToken: string, refreshToken: string, userInfo: UserInfoType | null = null): void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        if (userInfo) {
            localStorage.setItem(this.userInfoTokenKey, JSON.stringify(userInfo));
        }
    }


    public static removeAuthInfo(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoTokenKey);
    }


    public static getAuthInfo(key: string | null = null): AuthInfoType | string | null {
        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoTokenKey].includes(key)) {
            return localStorage.getItem(key);

        } else {
            return {
                    accessToken: localStorage.getItem(this.accessTokenKey) ?? '',
                    refreshToken: localStorage.getItem(this.refreshTokenKey) ?? '',
                    userInfo: JSON.parse(localStorage.getItem(this.userInfoTokenKey) || 'null'),

            };
        }
    }



    public static async updateRefreshToken(): Promise<boolean> {
        let result: boolean = false;
        const refreshToken: string | null = AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey) as string;
        if (refreshToken) {
            const response = await fetch(config.api + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken}),
            });

            if (response && response.status === 200) {
                const tokens: RefreshResponseType = await response.json();

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
    }
}


