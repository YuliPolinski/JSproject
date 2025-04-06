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
exports.Router = void 0;
const signup_1 = require("./components/signup");
const login_1 = require("./components/login");
const income_1 = require("./components/income");
const create_income_1 = require("./components/create-income");
const edit_income_1 = require("./components/edit-income");
const expenses_1 = require("./components/expenses");
const create_expenses_1 = require("./components/create-expenses");
const editing_expenses_1 = require("./components/editing-expenses");
const income_expenses_1 = require("./components/income-expenses");
const file_utils_1 = require("./utils/file-utils");
const logout_1 = require("./components/logout");
const auth_utils_1 = require("./utils/auth-utils");
const common_utils_1 = require("./utils/common-utils");
const create_income_expenses_1 = require("./components/create-income-expenses");
const editing_income_expenses_1 = require("./components/editing-income-expenses");
class Router {
    constructor() {
        this.currentRoute = null;
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        this.titlePageEl = document.getElementById('titlePage');
        this.contentEl = document.getElementById('content-block');
        this.initEvents();
        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/main.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    // new Main(this.openNewRoute.bind(this));
                },
                unload: () => {
                    // window.__MainInstance = null;
                },
                scripts: ['/js/color.esm.js']
            },
            {
                route: '/login',
                title: 'Вход в систему',
                filePathTemplate: '/templates/login.html',
                load: () => {
                    new login_1.Login(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/signup',
                title: 'Регистрация',
                filePathTemplate: '/templates/signup.html',
                load: () => {
                    new signup_1.Signup(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/logout',
                load: () => {
                    new logout_1.Logout(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/income',
                title: 'Доходы',
                filePathTemplate: '/templates/income.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new income_1.Income(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/create-income',
                title: 'Создание категории доходов',
                filePathTemplate: '/templates/create-income-category.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new create_income_1.CreateIncome(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/editing-income',
                title: 'Редактирование категории доходов',
                filePathTemplate: '/templates/editing-income-category.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new edit_income_1.EditIncome(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/expenses',
                title: 'Расходы',
                filePathTemplate: '/templates/expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new expenses_1.Expenses(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/create-expenses',
                title: 'Создание категории расходов',
                filePathTemplate: '/templates/create-expenses-category.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new create_expenses_1.CreateExpenses(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/editing-expenses',
                title: 'Редактирование категории расходов',
                filePathTemplate: '/templates/editing-expenses-category.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new editing_expenses_1.EditExpenses(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/income-expenses',
                title: 'Доходы и Расходы',
                filePathTemplate: '/templates/income-and-expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new income_expenses_1.IncomeExpenses(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/create-income-expenses',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/create-income-expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new create_income_expenses_1.CreateIncomeExpenses(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/editing-income-expenses',
                title: 'Редактирование дохода/расхода',
                filePathTemplate: '/templates/editing-income-expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new editing_income_expenses_1.EditIncomeExpenses(this.openNewRoute.bind(this));
                }
            },
        ];
    }
    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }
    openNewRoute(url) {
        return __awaiter(this, void 0, void 0, function* () {
            history.pushState({}, '', url);
            yield this.activateRoute();
        });
    }
    clickHandler(e) {
        return __awaiter(this, void 0, void 0, function* () {
            let element = null;
            if (e.target.nodeName === 'A') {
                element = e.target;
            }
            else if (e.target.parentNode instanceof HTMLAnchorElement) {
                element = e.target.parentNode;
            }
            if (element) {
                e.preventDefault();
                const currentRoute = window.location.pathname;
                const url = element.href.replace(window.location.origin, '');
                if (!url || currentRoute === url.replace('#', '') || url.startsWith('javascript:void(0)')) {
                    return;
                }
                yield this.openNewRoute(url);
            }
        });
    }
    activateRoute() {
        return __awaiter(this, void 0, void 0, function* () {
            const urlRoute = window.location.pathname;
            const isAuthenticated = auth_utils_1.AuthUtils.getAuthInfo(auth_utils_1.AuthUtils.accessTokenKey);
            if (!isAuthenticated && !['/login', '/signup'].includes(urlRoute)) {
                history.replaceState({}, '', '/login');
                yield this.activateRoute();
                return;
            }
            const oldRoute = this.routes.find(route => route.route === this.currentRoute);
            const newRoute = this.routes.find(item => item.route === urlRoute);
            if (oldRoute && oldRoute.unload && typeof oldRoute.unload === "function") {
                oldRoute.unload();
            }
            this.removeLoadedScripts();
            if (newRoute) {
                this.currentRoute = urlRoute;
                this.removeLoadedScripts();
                if (newRoute.scripts && newRoute.scripts.length > 0) {
                    for (const script of newRoute.scripts) {
                        try {
                            if (!document.querySelector('script[src="' + script + '"]')) {
                                console.log('Загрузка скрипта: ' + script);
                                yield file_utils_1.FileUtils.loadPageScript(script, true);
                            }
                            else {
                                console.log('Скрипт уже загружен: ' + script);
                            }
                        }
                        catch (error) {
                            console.error('Не удалось загрузить скрипт: ' + script, error);
                        }
                    }
                }
                if (newRoute.title) {
                    if (this.titlePageEl)
                        this.titlePageEl.innerHTML = newRoute.title;
                }
                if (newRoute.filePathTemplate) {
                    let contentBlock = this.contentEl;
                    if (newRoute.useLayout) {
                        const layoutHTML = yield fetch(newRoute.useLayout).then(response => response.text());
                        if (this.contentEl) {
                            this.contentEl.innerHTML = layoutHTML;
                        }
                        else {
                            console.error('contentEl не найден');
                            return;
                        }
                        contentBlock = document.querySelector('#content');
                        if (!contentBlock) {
                            return;
                        }
                        common_utils_1.CommonUtils.updateProfileName();
                        yield common_utils_1.CommonUtils.getBalance();
                    }
                    const pageHTML = yield fetch(newRoute.filePathTemplate).then(response => response.text());
                    if (contentBlock) {
                        contentBlock.innerHTML = pageHTML;
                    }
                    else {
                        console.error('Блок для вставки контента не найден');
                    }
                }
                if (newRoute.load && typeof newRoute.load === "function") {
                    newRoute.load();
                }
                this.activeNavItem();
            }
        });
    }
    removeLoadedScripts() {
        document.querySelectorAll('script[data-dynamic]').forEach(script => {
            script.remove();
        });
    }
    activeNavItem() {
        const currentPath = window.location.pathname;
        const navItemsEl = document.querySelectorAll('.nav-item a');
        if (!navItemsEl.length) {
            return;
        }
        navItemsEl.forEach(item => item.classList.remove('active'));
        navItemsEl.forEach(item => {
            var _a;
            const href = item.getAttribute('href');
            if (href && href !== 'javascript:void(0)' && href === currentPath) {
                item.classList.add('active');
                const parentDropdown = item.closest('.dropdown');
                if (parentDropdown) {
                    parentDropdown.classList.add('active');
                    (_a = parentDropdown.querySelector('.dropdown-toggle')) === null || _a === void 0 ? void 0 : _a.classList.add('active');
                }
            }
        });
    }
}
exports.Router = Router;
