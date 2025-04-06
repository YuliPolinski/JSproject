import {HttpResponseType} from "./http-response.type";

export type CategoryType = {
    id: number;
    title: string;
}

export type CategoryResponse = HttpResponseType<CategoryType>;
export type CategoriesResponse = HttpResponseType<CategoryType[]>;
export type CreateCategoryResponse = HttpResponseType<{ id: number }>;