import {ValidationUtils} from "../utils/validation-utils.js";
import {AuthServices} from "../utils/auth-services.js";
import {AuthUtils} from "../utils/auth-utils.js";

export class Signup {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.findElements();

        this.validations = [
            {element: this.nameElement, options: {pattern: /^[А-ЯЁ][а-яё]*( [А-ЯЁ][а-яё]*)*$/}},
            {element: this.emailElement, options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}},
            {element: this.passwordElement, options: {pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/}},
            {element: this.passwordRepeatElement, options: {compareTo: this.passwordElement.value}},
        ];

        document.getElementById('accept-button').addEventListener('click', this.signup.bind(this));

    }


        findElements()
        {
            this.nameElement = document.getElementById('name');
            this.emailElement = document.getElementById('email');
            this.passwordElement = document.getElementById('password');
            this.passwordRepeatElement = document.getElementById('repeatPassword');
        }

        async signup() {
            for (let i = 0; i < this.validations.length; i++) {
                if (this.validations[i].element === this.passwordRepeatElement) {
                    this.validations[i].options.compareTo = this.passwordElement.value;
                }
            }

            if (ValidationUtils.validateForm(this.validations)) {

                const fullName = this.nameElement.value.trim(); // Получаем полное имя
                const nameParts = fullName.split(/\s+/);

                const signupResult = AuthServices.signup({
                    name: nameParts[0] || "",
                    lastName: nameParts.slice(1).join(" ") || "",
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                    passwordRepeat: this.passwordRepeatElement.value,
                });

                if (signupResult) {
                    AuthUtils.setAuthInfo(signupResult.accessToken, signupResult.refreshToken, {
                        id: signupResult.id,
                        name: signupResult.name
                    });
                    return this.openNewRoute('/');
                }
            }
        }
    }