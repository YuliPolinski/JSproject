import {AuthUtils} from "./auth-utils";
import config from "../config/config";
import {HttpResponseType} from "../types/http-response.type";
import {AuthInfoType} from "../types/auth-info.type";
import {RequestInitType} from "../types/request-init.type";

export class HttpUtils {

    public static async request(url: string, method: string = 'GET', useAuth: boolean = true, body: Record<string, any> | null = null): Promise<HttpResponseType> {
        const result:  HttpResponseType = {
            error: false,
            response: null,
        }

        const params: RequestInitType = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        };
        let token: AuthInfoType | string | null = null;
        if (useAuth) {
            // token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
            // if (token) {
            //     params.headers['x-auth-token']  = token as string;
            // }
            token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
            if (useAuth && typeof token === 'string') {
                params.headers['x-auth-token'] = token;
            }
        }

        if (body) {
            params.body = JSON.stringify(body);
        }
        let response: Response | null = null;
        try {
            response = await fetch(config.api + url, params);
            result.response = await response.json();
        } catch (e) {
            result.error = true;
            return result;
        }
        if (response.status < 200 || response.status >= 300) {
            result.error = true;
            if (useAuth && response.status === 401) {

                if (!token) {
                    result.redirect = '/login';
                } else  {
                    const updateTokenResult: boolean = await AuthUtils.updateRefreshToken();

                    if (updateTokenResult) {
                        return this.request(url, method, useAuth, body);
                    } else  {
                        result.redirect = '/login';
                    }
                }
            }
        }
        return result;
    }
}