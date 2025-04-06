import {UserInfoType} from "./user-info.type";

export type AuthInfoType = {
    accessToken: string,
    refreshToken: string,
    userInfo: UserInfoType | null,
}