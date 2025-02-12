import { HttpUtils } from "../utils/http-utils";

export class OperationService {

    static async getOperations(period, startDate = null, endDate = null) {
        let url = `/operations?period=${period}`;

        if (period === "interval" && startDate && endDate) {
            url += `&dateFrom=${startDate}&dateTo=${endDate}`;
        }

        return await HttpUtils.request(url, "GET", true);
    }

    static async getOperation(id) {
        return await HttpUtils.request(`/operations/${id}`, "GET", true);
    }

    static async createOperation(data) {
        return await HttpUtils.request("/operations", "POST", true, data);
    }

    static async updateOperation(id, data) { 
        return await HttpUtils.request(`/operations/${id}`, "PUT", true, data);
    }

    static async deleteOperation(id) {
        return await HttpUtils.request(`/operations/${id}`, "DELETE", true);
    }

    static formatDate(dateString) {
        if (!dateString) {
            return "";
        }

        const [year, month, day] = dateString.split("-");
        if (!year || !month || !day) {
            return "";
        }

        return `${day}.${month}.${year}`;
    }

    static reverseFormatDate(dateString) {

        if (!dateString || typeof dateString !== "string") {
            return "";
        }

        const parts = dateString.split("-");

        if (parts.length !== 3) {
            return "";
        }

        const [first, second, third] = parts;

        if (first.length === 4) {
            return dateString;
        }

        const formattedDate = `${third}-${second}-${first}`;
        console.log(formattedDate);

        return formattedDate;
    }


}