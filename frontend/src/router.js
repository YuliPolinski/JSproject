import {Main} from "./components/main.js";
import {Signup} from "./components/signup.js";
import {Login} from "./components/login.js";
import {Income} from "./components/income.js";
import {CreateIncome} from "./components/create-income.js";
import {EditIncome} from "./components/edit-income.js";
import {Expenses} from "./components/expenses.js";
import {CreateExpenses} from "./components/create-expenses.js";
import {EditExpenses} from "./components/editing-expenses.js";
import {IncomeExpenses} from "./components/income-expenses.js";
import {FileUtils} from "./utils/file-utils.js";
import {Logout} from "./components/logout.js";

export class Router {
    constructor() {
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
                    new Main(this.openNewRoute.bind(this));
                },
                scripts: ['chart.js', '/js/color.esm.js']
            },
            {
                route: '/login',
                title: 'Вход в систему',
                filePathTemplate: '/templates/login.html',
                load: () => {
                    new Login(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/signup',
                title: 'Регистрация',
                filePathTemplate: '/templates/signup.html',
                load: () => {
                    new Signup(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/income',
                title: 'Доходы',
                filePathTemplate: '/templates/income.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Income(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/create-income',
                title: 'Создание категории доходов',
                filePathTemplate: '/templates/create-income-category.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CreateIncome(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/editing-income',
                title: 'Редактирование категории доходов',
                filePathTemplate: '/templates/editing-income-category.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new EditIncome(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/expenses',
                title: 'Расходы',
                filePathTemplate: '/templates/expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Expenses(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/create-expenses',
                title: 'Создание категории расходов',
                filePathTemplate: '/templates/create-expenses-category.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CreateExpenses(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/editing-expenses',
                title: 'Редактирование категории расходов',
                filePathTemplate: '/templates/editing-expenses-category.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new EditExpenses(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/income-expenses',
                title: 'Доходы и Расходы',
                filePathTemplate: '/templates/income-and-expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeExpenses(this.openNewRoute.bind(this));
                }
            },
        ];

    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    async openNewRoute(url) {
        history.pushState({}, '', url);
        await this.activateRoute();
    }

    async clickHandler(e) {
        let element = null;
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }

        if (element) {
            e.preventDefault();

            const currentRoute = window.location.pathname;
            const url = element.href.replace(window.location.origin, '');
            if (!url || (currentRoute === url.replace('#', '')) || url.startsWith('javascript:void(0)')) {
                return;
            }
            await this.openNewRoute(url);
        }
    }

    async activateRoute() {
        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            this.removeLoadedScripts();

            if (newRoute.scripts && newRoute.scripts.length > 0) {
                for (const script of newRoute.scripts) {
                    try {
                        if (!document.querySelector('script[src="' + script + '"]')) {
                            console.log('Загрузка скрипта: ' + script);
                            await FileUtils.loadPageScript(script, true);
                        } else {
                            console.log('Скрипт уже загружен: ' + script);
                        }
                    } catch (error) {
                        console.error('Не удалось загрузить скрипт: ' + script, error);
                    }
                }
            }

            if (newRoute.title) {
                this.titlePageEl.innerHTML = newRoute.title;
            }
            if (newRoute.filePathTemplate) {
                let contentBlock = this.contentEl;

                if (newRoute.useLayout) {
                    const layoutHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    if (this.contentEl) {
                        this.contentEl.innerHTML = layoutHTML;
                    } else {
                        console.error('contentEl не найден');
                        return;
                    }

                    contentBlock = document.querySelector('#content');
                    if (!contentBlock) {
                        console.error('Блок #content не найден внутри layout.');
                        return;
                    }
                }

                const pageHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
                if (contentBlock) {
                    contentBlock.innerHTML = pageHTML;
                } else {
                    console.error('Блок для вставки контента не найден');
                }
            }

            if (newRoute.load && typeof newRoute.load === "function") {
                newRoute.load();
            }
        }
    }

    removeLoadedScripts() {
        document.querySelectorAll('script[data-dynamic]').forEach(script => {
            script.remove();
        });
    }
}