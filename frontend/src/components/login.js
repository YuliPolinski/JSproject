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
exports.Login = void 0;
const auth_utils_1 = require("../utils/auth-utils");
const validation_utils_1 = require("../utils/validation-utils");
const auth_services_1 = require("../utils/auth-services");
class Login {
    constructor(openNewRoute) {
        this.validations = [];
        this.openNewRoute = openNewRoute;
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.rememberMeElement = document.getElementById('rememberMe');
        if (auth_utils_1.AuthUtils.getAuthInfo(auth_utils_1.AuthUtils.accessTokenKey)) {
            this.openNewRoute('/').then();
            return;
        }
        // this.findElements();
        this.validations = [
            { element: this.passwordElement },
            { element: this.emailElement, options: { pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/ } },
        ];
        const acceptButton = document.getElementById('accept-button');
        if (acceptButton) {
            acceptButton.addEventListener('click', this.login.bind(this));
        }
    }
    // private findElements(): void {
    //
    //     this.emailElement = document.getElementById('email') as HTMLInputElement;
    //     this.passwordElement = document.getElementById('password') as HTMLInputElement;
    //     this.rememberMeElement = document.getElementById('rememberMe') as HTMLInputElement;
    // }
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            this.emailElement.classList.remove('is-invalid');
            this.passwordElement.classList.remove('is-invalid');
            if (validation_utils_1.ValidationUtils.validateForm(this.validations)) {
                const loginResult = yield auth_services_1.AuthServices.login({
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                    rememberMe: this.rememberMeElement.checked
                });
                if (loginResult && loginResult.tokens && loginResult.user) {
                    auth_utils_1.AuthUtils.setAuthInfo(loginResult.tokens.accessToken, loginResult.tokens.refreshToken, {
                        id: loginResult.user.id,
                        name: loginResult.user.name,
                        lastName: loginResult.user.lastName
                    });
                    return this.openNewRoute('/');
                }
                this.emailElement.classList.add('is-invalid');
                this.passwordElement.classList.add('is-invalid');
            }
        });
    }
}
exports.Login = Login;
