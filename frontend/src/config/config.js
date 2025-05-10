"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const host = process.env.HOST;
const config = {
    host: host,
    api: host + '/api',
};
exports.default = config;
