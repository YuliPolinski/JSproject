export class ValidationUtils {
    static validateForm(validations) {
        let isValid = true;

        for (let i = 0; i < validations.length; i++) {
            const fieldValid = ValidationUtils.validateField(validations[i].element, validations[i].options);
            if (!fieldValid) {
                isValid = false;
            }
        }
        return isValid;
    }

    static validateField(element, options) {
        let isValid = element.value.trim() !== '';

        if (options) {
            if (options.hasOwnProperty('pattern')) {
                isValid = element.value && element.value.match(options.pattern);
            } else if (options.hasOwnProperty('compareTo')) {
                isValid = element.value && element.value === options.compareTo;
            }
        }

        if (isValid) {
            element.classList.remove('is-invalid');
        } else {
            element.classList.add('is-invalid');
        }

        return isValid;
    }
}