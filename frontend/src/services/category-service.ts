import {HttpUtils} from "../utils/http-utils";
import {CategoryType, CategoryResponse, CategoriesResponse,} from "../types/category.type";
import {IdResponse, BaseResponse} from "../types/http-response.type";

export class CategoryService {
    public static async getCategories(type: string): Promise<CategoriesResponse> {
        const correctedType = type === "expenses" ? "expense" : type;

        const result: CategoriesResponse = await HttpUtils.request(`/categories/${correctedType}`, "GET", true);

        if (result.redirect || result.error || !result.response) {
            return {
                error: true,
                response: null,
                redirect: result.redirect
            };
        }

        return result;
    }

    public static async getCategory(type: string, id: number): Promise<CategoryResponse> {
        const correctedType = type === "expenses" ? "expense" : type;

        const result: CategoryResponse = await HttpUtils.request(`/categories/${correctedType}/${id}`, "GET", true);

        if (result.redirect || result.error || !result.response) {
            return {
                error: true,
                response: null,
                redirect: result.redirect
            };
        }

        return result;
    }

    public static async createCategory(type: string, data: Partial<CategoryType>): Promise<IdResponse> {
        const correctedType = type === "expenses" ? "expense" : type;

        const result: IdResponse = await HttpUtils.request(`/categories/${correctedType}`, "POST", true, data);

        if (result.redirect || result.error || !result.response?.id) {
            return {
                error: true,
                response: null,
                redirect: result.redirect
            };
        }

        return result;
    }

    public static async updateCategory(type: string, id: number, data: Partial<CategoryType>): Promise<BaseResponse> {
        const correctedType = type === "expenses" ? "expense" : type;

        const result: BaseResponse = await HttpUtils.request(`/categories/${correctedType}/${id}`, "PUT", true, data);

        if (result.redirect || result.error) {
            return {
                error: true,
                response: null,
                redirect: result.redirect
            };
        }

        return result;
    }

    public static async deleteCategory(type: string, id: number): Promise<BaseResponse> {
        const correctedType = type === "expenses" ? "expense" : type;

        const result: BaseResponse = await HttpUtils.request(`/categories/${correctedType}/${id}`, "DELETE", true);

        if (result.redirect || result.error) {
            return {
                error: true,
                response: null,
                redirect: result.redirect
            };
        }

        return result;
    }
}