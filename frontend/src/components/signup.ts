import {ValidationUtils} from "../utils/validation-utils";
import {AuthServices} from "../utils/auth-services";
import {AuthUtils} from "../utils/auth-utils";
import {CommonUtils} from "../utils/common-utils";
import {ValidationFieldType} from "../types/validation-field.type";
import {LoginResponseType} from "../types/login-response.type";

export class Signup {
    public openNewRoute: (url: string) => Promise<void>;
    readonly validations: ValidationFieldType[];

    private nameElement!: HTMLInputElement;
    private emailElement!: HTMLInputElement;
    private passwordElement!: HTMLInputElement;
    private passwordRepeatElement!: HTMLInputElement;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;

        this.findElements();

        this.validations = [
            {element: this.nameElement, options: {pattern: /^[А-ЯЁ][а-яё]*( [А-ЯЁ][а-яё]*)*$/}},
            {element: this.emailElement, options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}},
            {element: this.passwordElement, options: {pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/}},
            {element: this.passwordRepeatElement, options: {compareTo: this.passwordElement.value}},
        ];

        const acceptButton = document.getElementById('accept-button') as HTMLButtonElement | null;

        if (acceptButton) {
            acceptButton.addEventListener('click', this.signup.bind(this));
        }
    }

    private findElements(): void {
        this.nameElement = document.getElementById('name') as HTMLInputElement;
        this.emailElement = document.getElementById('email') as HTMLInputElement;
        this.passwordElement = document.getElementById('password') as HTMLInputElement;
        this.passwordRepeatElement = document.getElementById('repeatPassword') as HTMLInputElement;
    }

    public async signup(): Promise<void> {

        for (let i = 0; i < this.validations.length; i++) {
            const {element, options} = this.validations[i];
            if (element === this.passwordRepeatElement && options) {
                options.compareTo = this.passwordElement.value;
            }
        }

        if (ValidationUtils.validateForm(this.validations)) {

            const fullName: string = this.nameElement.value.trim(); // Получаем полное имя
            const nameParts: string[] = fullName.split(/\s+/);

            const signupResult: boolean | LoginResponseType = await AuthServices.signup({
                name: nameParts[0] || "",
                lastName: nameParts.slice(1).join(" ") || "",
                email: this.emailElement.value,
                password: this.passwordElement.value,
                passwordRepeat: this.passwordRepeatElement.value,
            });

            if (signupResult) {
                AuthUtils.setAuthInfo(signupResult.tokens.accessToken, signupResult.tokens.refreshToken, {
                    id: signupResult.user.id,
                    name: signupResult.user.name,
                    lastName: signupResult.user.lastName,
                });

                CommonUtils.updateProfileName();
                return this.openNewRoute('/');
            }
        }
    }
}