import { HttpUtils } from "../utils/http-utils";

export class CategoryService {
    static async getCategories(type) {
        const correctedType = type === "expenses" ? "expense" : type;
        const returnObject = { error: false, redirect: null, categories: null };

        const result = await HttpUtils.request(`/categories/${correctedType}`, "GET", true);
        if (result.redirect || result.error || !result.response || result.response?.error) {
            returnObject.error = `Ошибка при получении категорий (${correctedType}).`;
            if (result.redirect) returnObject.redirect = result.redirect;
            return returnObject;
        }

        returnObject.categories = result.response;
        return returnObject;
    }

    static async getCategory(type, id) {
        const correctedType = type === "expenses" ? "expense" : type;
        const returnObject = { error: false, redirect: null, category: null };

        const result = await HttpUtils.request(`/categories/${correctedType}/${id}`, "GET", true);
        if (result.redirect || result.error || !result.response || result.response?.error) {
            returnObject.error = `Ошибка при получении категории (${correctedType}).`;
            if (result.redirect) returnObject.redirect = result.redirect;
            return returnObject;
        }

        returnObject.category = result.response;
        return returnObject;
    }

    static async createCategory(type, data) {
        const correctedType = type === "expenses" ? "expense" : type;
        const returnObject = { error: false, redirect: null, id: null };

        const result = await HttpUtils.request(`/categories/${correctedType}`, "POST", true, data);
        if (result.redirect || result.error || !result.response || result.response?.error) {
            returnObject.error = `Ошибка при создании категории (${correctedType}).`;
            if (result.redirect) returnObject.redirect = result.redirect;
            return returnObject;
        }

        returnObject.id = result.response.id;
        return returnObject;
    }

    static async updateCategory(type, id, data) {
        const correctedType = type === "expenses" ? "expense" : type;
        const returnObject = { error: false, redirect: null };

        const result = await HttpUtils.request(`/categories/${correctedType}/${id}`, "PUT", true, data);
        if (result.redirect || result.error || !result.response || result.response?.error) {
            returnObject.error = `Ошибка при обновлении категории (${correctedType}).`;
            if (result.redirect) returnObject.redirect = result.redirect;
            return returnObject;
        }

        return returnObject;
    }

    static async deleteCategory(type, id) {
        const correctedType = type === "expenses" ? "expense" : type;
        const returnObject = { error: false, redirect: null };

        const result = await HttpUtils.request(`/categories/${correctedType}/${id}`, "DELETE", true);
        if (result.redirect || result.error || !result.response || result.response?.error) {
            returnObject.error = `Ошибка при удалении категории (${correctedType}).`;
            if (result.redirect) returnObject.redirect = result.redirect;
            return returnObject;
        }

        return returnObject;
    }
}