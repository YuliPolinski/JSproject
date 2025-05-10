import {AuthUtils} from "../utils/auth-utils";
import {AuthServices} from "../utils/auth-services";

export class Logout {

    public openNewRoute: (url: string) => Promise<void>;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            this.openNewRoute('/login').then();
            return;
        }

        this.logout().then();
    }


    private async logout(): Promise<void> {

        await AuthServices.logout({refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey) as string});
        AuthUtils.removeAuthInfo();
        await this.openNewRoute('/login');
    }
}