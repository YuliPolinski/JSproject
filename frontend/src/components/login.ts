import {AuthUtils} from "../utils/auth-utils";
import {ValidationUtils} from "../utils/validation-utils";
import {AuthServices} from "../utils/auth-services";
import {ValidationFieldType} from "../types/validation-field.type";
import {LoginResponseType} from "../types/login-response.type";

export class Login {

    public openNewRoute: (url: string) => Promise<void>;
    readonly passwordElement: HTMLInputElement;
    readonly emailElement: HTMLInputElement;
    private rememberMeElement: HTMLInputElement;
    readonly validations: ValidationFieldType[] = [];

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;

        this.emailElement = document.getElementById('email') as HTMLInputElement;
        this.passwordElement = document.getElementById('password') as HTMLInputElement;
        this.rememberMeElement = document.getElementById('rememberMe') as HTMLInputElement;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/').then();
            return;
        }

        this.validations = [
            {element: this.passwordElement},
            {element: this.emailElement, options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}},
        ]

        const acceptButton = document.getElementById('accept-button') as HTMLButtonElement | null;

        if (acceptButton) {
            acceptButton.addEventListener('click', this.login.bind(this));
        }
    }

    private async login(): Promise<void> {

        this.emailElement.classList.remove('is-invalid');
        this.passwordElement.classList.remove('is-invalid');

        if (ValidationUtils.validateForm(this.validations)) {
            const loginResult: LoginResponseType = await AuthServices.login({
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