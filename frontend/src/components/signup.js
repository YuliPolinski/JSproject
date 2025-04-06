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
exports.Signup = void 0;
const validation_utils_1 = require("../utils/validation-utils");
const auth_services_1 = require("../utils/auth-services");
const auth_utils_1 = require("../utils/auth-utils");
const common_utils_1 = require("../utils/common-utils");
class Signup {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.findElements();
        this.validations = [
            { element: this.nameElement, options: { pattern: /^[А-ЯЁ][а-яё]*( [А-ЯЁ][а-яё]*)*$/ } },
            { element: this.emailElement, options: { pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/ } },
            { element: this.passwordElement, options: { pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/ } },
            { element: this.passwordRepeatElement, options: { compareTo: this.passwordElement.value } },
        ];
        const acceptButton = document.getElementById('accept-button');
        if (acceptButton) {
            acceptButton.addEventListener('click', this.signup.bind(this));
        }
    }
    findElements() {
        this.nameElement = document.getElementById('name');
        ;
        this.emailElement = document.getElementById('email');
        ;
        this.passwordElement = document.getElementById('password');
        ;
        this.passwordRepeatElement = document.getElementById('repeatPassword');
        ;
    }
    signup() {
        return __awaiter(this, void 0, void 0, function* () {
            // for (let i = 0; i < this.validations.length; i++) {
            //     if (this.validations[i].element === this.passwordRepeatElement) {
            //         this.validations[i].options.compareTo = this.passwordElement.value;
            //     }
            // }
            for (let i = 0; i < this.validations.length; i++) {
                const { element, options } = this.validations[i];
                if (element === this.passwordRepeatElement && options) {
                    options.compareTo = this.passwordElement.value;
                }
            }
            if (validation_utils_1.ValidationUtils.validateForm(this.validations)) {
                const fullName = this.nameElement.value.trim(); // Получаем полное имя
                const nameParts = fullName.split(/\s+/);
                const signupResult = yield auth_services_1.AuthServices.signup({
                    name: nameParts[0] || "",
                    lastName: nameParts.slice(1).join(" ") || "",
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                    // passwordRepeat: this.passwordRepeatElement.value,
                });
                if (signupResult) {
                    auth_utils_1.AuthUtils.setAuthInfo(signupResult.tokens.accessToken, signupResult.tokens.refreshToken, {
                        id: signupResult.user.id,
                        name: signupResult.user.name,
                        lastName: signupResult.user.lastName,
                    });
                    common_utils_1.CommonUtils.updateProfileName();
                    return this.openNewRoute('/');
                }
            }
        });
    }
}
exports.Signup = Signup;
