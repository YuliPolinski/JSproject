import {HttpUtils} from "../utils/http-utils";
import {HttpResponseType} from "../types/http-response.type";
import {OperationRequestType} from "../types/operations.type";

export class OperationService {

    public static async getOperations(period: string, startDate: string | null = null, endDate: string | null = null): Promise<HttpResponseType> {
        let url: string = `/operations?period=${period}`;

        if (period === "interval" && startDate && endDate) {
            url += `&dateFrom=${startDate}&dateTo=${endDate}`;
        }

        return await HttpUtils.request(url, "GET", true);
    }

    public static async getOperation(id: number): Promise<HttpResponseType> {
        return await HttpUtils.request(`/operations/${id}`, "GET", true);
    }

    public static async createOperation(data: OperationRequestType): Promise<HttpResponseType> {
        return await HttpUtils.request("/operations", "POST", true, data);
    }

    public static async updateOperation(id: number, data: OperationRequestType): Promise<HttpResponseType> {
        return await HttpUtils.request(`/operations/${id}`, "PUT", true, data);
    }

    public static async deleteOperation(id: number): Promise<HttpResponseType> {
        return await HttpUtils.request(`/operations/${id}`, "DELETE", true);
    }

    public static formatDate(dateString: string): string {
        if (!dateString) {
            return "";
        }

        const [year, month, day]: string[] = dateString.split("-");
        if (!year || !month || !day) {
            return "";
        }

        return `${day}.${month}.${year}`;
    }

    public static reverseFormatDate(dateString: string): string {

        if (!dateString) {
            return "";
        }

        const parts: string[] = dateString.split("-");

        if (parts.length !== 3) {
            return "";
        }

        const [first, second, third] = parts;

        if (first.length === 4) {
            return dateString;
        }

        const formattedDate: string = `${third}-${second}-${first}`;
        console.log(formattedDate);

        return formattedDate;
    }


}