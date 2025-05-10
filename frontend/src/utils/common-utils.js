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
exports.CommonUtils = void 0;
const auth_utils_1 = require("./auth-utils");
const http_utils_1 = require("./http-utils");
class CommonUtils {
    static updateProfileName() {
        setTimeout(() => {
            const profileNameElement = document.getElementById('profile-name');
            // let userInfo: UserInfoType = AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey);
            let userInfo = JSON.parse(auth_utils_1.AuthUtils.getAuthInfo(auth_utils_1.AuthUtils.userInfoTokenKey));
            if (profileNameElement && userInfo) {
                // userInfo = JSON.parse(userInfo);
                profileNameElement.innerText = userInfo.name + " " + userInfo.lastName;
            }
        }, 300);
    }
    static getBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let response = yield http_utils_1.HttpUtils.request('/balance', 'GET', true);
                if (!response || response.error || !response.response) {
                    return 0;
                }
                let balanceElement = document.getElementById('balance');
                let balance = (_a = response.response.balance) !== null && _a !== void 0 ? _a : 0;
                if (balanceElement) {
                    balanceElement.innerText = balance + " $";
                }
                return balance;
            }
            catch (error) {
                return 0;
            }
        });
    }
}
exports.CommonUtils = CommonUtils;
