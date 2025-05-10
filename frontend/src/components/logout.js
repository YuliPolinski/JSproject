import {AuthUtils} from "../utils/auth-utils.js";
import {AuthServices} from "../utils/auth-services";

export class Logout {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.logout().then();
    }


    async logout() {

        await AuthServices.logout({refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)});
        AuthUtils.removeAuthInfo();
        this.openNewRoute('/login')
    }
}