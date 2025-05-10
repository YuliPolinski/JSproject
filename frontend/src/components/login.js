import {AuthUtils} from "../utils/auth-utils.js";
import {ValidationUtils} from "../utils/validation-utils.js";
import {AuthServices} from "../utils/auth-services.js";

export class Login {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        this.findElements();

        this.validations = [
            {element: this.passwordElement},
            {element: this.emailElement, options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}},
        ]

        document.getElementById('accept-button').addEventListener('click', this.login.bind(this));
    }

    findElements() {
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.rememberMeElement = document.getElementById('rememberMe');
    }

    async login() {

        this.emailElement.classList.remove('is-invalid');
        this.passwordElement.classList.remove('is-invalid');

        if (ValidationUtils.validateForm(this.validations)) {
            const loginResult = await AuthServices.login({
                email: this.emailElement.value,
                password: this.passwordElement.value,
                rememberMe: this.rememberMeElement.checked
            });

            if (loginResult && loginResult.tokens && loginResult.user) {
                AuthUtils.setAuthInfo(
                    loginResult.tokens.accessToken,
                    loginResult.tokens.refreshToken,
                    {
                        id: loginResult.user.id,
                        name: loginResult.user.name,
                        lastName: loginResult.user.lastName
                    }
                );
                return this.openNewRoute('/');
            }

            this.emailElement.classList.add('is-invalid');
            this.passwordElement.classList.add('is-invalid');
        }
    }
}