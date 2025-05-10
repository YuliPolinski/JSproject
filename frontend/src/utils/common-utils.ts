import {AuthUtils} from "./auth-utils";
import {HttpUtils} from "./http-utils";
import {UserInfoType} from "../types/user-info.type";
import {HttpResponseType} from "../types/http-response.type";

export class CommonUtils {

    public static updateProfileName(): void {
        setTimeout(() => {
            const profileNameElement: HTMLElement | null = document.getElementById('profile-name');
            // let userInfo: UserInfoType = AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey);

            let userInfo = JSON.parse(AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey) as string) as UserInfoType;


            if (profileNameElement && userInfo) {
                // userInfo = JSON.parse(userInfo);
                profileNameElement.innerText = userInfo.name + " " + userInfo.lastName;
            }
        }, 300);
    }

    public static async getBalance(): Promise<number> {
        try {
            let response: HttpResponseType = await HttpUtils.request('/balance', 'GET', true);

            if (!response || response.error || !response.response) {
                return 0;
            }

            let balanceElement: HTMLElement |  null = document.getElementById('balance');
            let balance: number = response.response.balance ?? 0;
            if (balanceElement) {
                balanceElement.innerText = balance + " $";
            }

            return balance;
        } catch (error) {
            return 0;
        }
    }
}

