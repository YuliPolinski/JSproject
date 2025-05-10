"use strict";
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
exports.OperationService = void 0;
const http_utils_1 = require("../utils/http-utils");
class OperationService {
    static getOperations(period_1) {
        return __awaiter(this, arguments, void 0, function* (period, startDate = null, endDate = null) {
            let url = `/operations?period=${period}`;
            if (period === "interval" && startDate && endDate) {
                url += `&dateFrom=${startDate}&dateTo=${endDate}`;
            }
            return yield http_utils_1.HttpUtils.request(url, "GET", true);
        });
    }
    static getOperation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield http_utils_1.HttpUtils.request(`/operations/${id}`, "GET", true);
        });
    }
    static createOperation(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield http_utils_1.HttpUtils.request("/operations", "POST", true, data);
        });
    }
    static updateOperation(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield http_utils_1.HttpUtils.request(`/operations/${id}`, "PUT", true, data);
        });
    }
    static deleteOperation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield http_utils_1.HttpUtils.request(`/operations/${id}`, "DELETE", true);
        });
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
exports.OperationService = OperationService;
