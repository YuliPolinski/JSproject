"use strict";
// import { HttpUtils } from "../utils/http-utils";
// import {CategoryType, CreateCategoryResponse, GetCategoriesResponse, GetCategoryResponse} from "../types/category.type";
// import {HttpResponseType} from "../types/http-response.type";
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
exports.CategoryService = void 0;
// export class CategoryService {
//     public static async getCategories(type: string): Promise<GetCategoriesResponse> {
//         const correctedType: string = type === "expenses" ? "expense" : type;
//         const returnObject: GetCategoriesResponse = { error: false, redirect: null, categories: null };
//
//         const result: HttpResponseType = await HttpUtils.request(`/categories/${correctedType}`, "GET", true);
//         if (result.redirect || result.error || !result.response || result.response?.error) {
//             returnObject.error = `Ошибка при получении категорий (${correctedType}).`;
//             if (result.redirect) returnObject.redirect = result.redirect;
//             return returnObject;
//         }
//
//         returnObject.categories = result.response;
//         return returnObject;
//     }
//
//     public static async getCategory(type: string, id: number): Promise<GetCategoryResponse> {
//         const correctedType: string = type === "expenses" ? "expense" : type;
//         const returnObject: GetCategoryResponse = { error: false, redirect: null, category: null };
//
//         const result: HttpResponseType<CategoryType> = await HttpUtils.request(`/categories/${correctedType}/${id}`, "GET", true);
//         if (result.redirect || result.error || !result.response) {
//             returnObject.error = `Ошибка при получении категории (${correctedType}).`;
//             if (result.redirect) returnObject.redirect = result.redirect;
//             return returnObject;
//         }
//
//         returnObject.category = result.response;
//         return returnObject;
//     }
//
//     public static async createCategory(type: string, data: Partial<CategoryType>): Promise<CreateCategoryResponse> {
//         const correctedType: string = type === "expenses" ? "expense" : type;
//         const returnObject:CreateCategoryResponse = { error: false, redirect: null, id: null };
//
//         const result: HttpResponseType = await HttpUtils.request(`/categories/${correctedType}`, "POST", true, data);
//         if (result.redirect || result.error || !result.response || result.response?.error) {
//             returnObject.error = `Ошибка при создании категории (${correctedType}).`;
//             if (result.redirect) returnObject.redirect = result.redirect;
//             return returnObject;
//         }
//
//         returnObject.id = result.response.id;
//         return returnObject;
//     }
//
//     public static async updateCategory(type: string, id: number, data: Partial<CategoryType>): Promise<HttpResponseType<null>> {
//         const correctedType: string = type === "expenses" ? "expense" : type;
//         const returnObject: HttpResponseType<null> = { error: false, redirect: null };
//
//         const result = await HttpUtils.request(`/categories/${correctedType}/${id}`, "PUT", true, data);
//         if (result.redirect || result.error || !result.response || result.response?.error) {
//             returnObject.error = `Ошибка при обновлении категории (${correctedType}).`;
//             if (result.redirect) returnObject.redirect = result.redirect;
//             return returnObject;
//         }
//
//         return returnObject;
//     }
//
//     static async deleteCategory(type, id) {
//         const correctedType = type === "expenses" ? "expense" : type;
//         const returnObject = { error: false, redirect: null };
//
//         const result = await HttpUtils.request(`/categories/${correctedType}/${id}`, "DELETE", true);
//         if (result.redirect || result.error || !result.response || result.response?.error) {
//             returnObject.error = `Ошибка при удалении категории (${correctedType}).`;
//             if (result.redirect) returnObject.redirect = result.redirect;
//             return returnObject;
//         }
//
//         return returnObject;
//     }
// }
const http_utils_1 = require("../utils/http-utils");
class CategoryService {
    static getCategories(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const correctedType = type === "expenses" ? "expense" : type;
            const result = yield http_utils_1.HttpUtils.request(`/categories/${correctedType}`, "GET", true);
            if (result.redirect || result.error || !result.response) {
                return {
                    error: true,
                    response: null,
                    redirect: result.redirect
                };
            }
            return result;
        });
    }
    static getCategory(type, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const correctedType = type === "expenses" ? "expense" : type;
            const result = yield http_utils_1.HttpUtils.request(`/categories/${correctedType}/${id}`, "GET", true);
            if (result.redirect || result.error || !result.response) {
                return {
                    error: true,
                    response: null,
                    redirect: result.redirect
                };
            }
            return result;
        });
    }
    static createCategory(type, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const correctedType = type === "expenses" ? "expense" : type;
            const result = yield http_utils_1.HttpUtils.request(`/categories/${correctedType}`, "POST", true, data);
            if (result.redirect || result.error || !((_a = result.response) === null || _a === void 0 ? void 0 : _a.id)) {
                return {
                    error: true,
                    response: null,
                    redirect: result.redirect
                };
            }
            return result;
        });
    }
    static updateCategory(type, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const correctedType = type === "expenses" ? "expense" : type;
            const result = yield http_utils_1.HttpUtils.request(`/categories/${correctedType}/${id}`, "PUT", true, data);
            if (result.redirect || result.error) {
                return {
                    error: true,
                    response: null,
                    redirect: result.redirect
                };
            }
            return result;
        });
    }
    static deleteCategory(type, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const correctedType = type === "expenses" ? "expense" : type;
            const result = yield http_utils_1.HttpUtils.request(`/categories/${correctedType}/${id}`, "DELETE", true);
            if (result.redirect || result.error) {
                return {
                    error: true,
                    response: null,
                    redirect: result.redirect
                };
            }
            return result;
        });
    }
}
exports.CategoryService = CategoryService;
