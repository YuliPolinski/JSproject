"use strict";
// import {ValidationFieldType} from "../types/validation-field.type";
//
// export class ValidationUtils {
//     public static validateForm(validations: ValidationFieldType[]): boolean {
//         let isValid: boolean = true;
//
//         for (let i = 0; i < validations.length; i++) {
//             const fieldValid: boolean = ValidationUtils.validateField(validations[i].element, validations[i].options);
//             if (!fieldValid) {
//                 isValid = false;
//             }
//         }
//         return isValid;
//     }
//
//     private static validateField(element: HTMLInputElement, options: ValidationFieldType): boolean {
//         let isValid: boolean = element.value.trim() !== '';
//
//         if (options) {
//             if (options.hasOwnProperty('pattern')) {
//                 isValid = element.value && element.value.match(options.pattern);
//             } else if (options.hasOwnProperty('compareTo')) {
//                 isValid = element.value && element.value === options.compareTo;
//             }
//         }
//
//         if (isValid) {
//             element.classList.remove('is-invalid');
//         } else {
//             element.classList.add('is-invalid');
//         }
//
//         return isValid;
//     }
// }
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationUtils = void 0;
class ValidationUtils {
    static validateForm(validations) {
        let isValid = true;
        for (let i = 0; i < validations.length; i++) {
            const fieldValid = ValidationUtils.validateField(validations[i]);
            if (!fieldValid) {
                isValid = false;
            }
        }
        return isValid;
    }
    static validateField(field) {
        const { element, options } = field;
        let isValid = element.value.trim() !== "";
        if (options) {
            if (options.pattern) {
                isValid = !!element.value && options.pattern.test(element.value);
            }
            else if (options.compareTo !== undefined) {
                isValid = !!element.value && element.value === options.compareTo;
            }
        }
        if (isValid) {
            element.classList.remove("is-invalid");
        }
        else {
            element.classList.add("is-invalid");
        }
        return isValid;
    }
}
exports.ValidationUtils = ValidationUtils;
