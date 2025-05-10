import {Main} from "./components/main";
import {Signup} from "./components/signup";
import {Login} from "./components/login";
import {Income} from "./components/income";
import {CreateIncome} from "./components/create-income";
import {EditIncome} from "./components/edit-income";
import {Expenses} from "./components/expenses";
import {CreateExpenses} from "./components/create-expenses";
import {EditExpenses} from "./components/editing-expenses";
import {IncomeExpenses} from "./components/income-expenses";
import {FileUtils} from "./utils/file-utils";
import {Logout} from "./components/logout";
import {AuthUtils} from "./utils/auth-utils";
import {CommonUtils} from "./utils/common-utils";
import {CreateIncomeExpenses} from "./components/create-income-expenses";
import {EditIncomeExpenses} from "./components/editing-income-expenses";
import {RouteType} from "./types/route.type";

export class Router {

    readonly titlePageEl: HTMLElement | null;
    readonly contentEl: HTMLElement | null;
    private routes: RouteType[];
    private currentRoute: string | null = null;

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
                    new Main();
                },
                unload: () => {
                    window.__MainInstance = null;
                },
                scripts: ['/js/color.esm.js']
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
            {
                route: '/create-income-expenses',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/create-income-expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CreateIncomeExpenses(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/editing-income-expenses',
                title: 'Редактирование дохода/расхода',
                filePathTemplate: '/templates/editing-income-expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new EditIncomeExpenses(this.openNewRoute.bind(this));
                }
            },
        ];

    }

    private initEvents(): void {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    public async openNewRoute(url: string): Promise<void> {
        history.pushState({}, '', url);
        await this.activateRoute();
    }

    private async clickHandler(e: MouseEvent): Promise<void> {
        let element: HTMLAnchorElement | null = null;
        if ((e.target as HTMLElement).nodeName === 'A') {
            element = e.target as HTMLAnchorElement;
        } else if ((e.target as HTMLElement).parentNode instanceof HTMLAnchorElement) {
            element = (e.target as HTMLElement).parentNode as HTMLAnchorElement;
        }

        if (element) {
            e.preventDefault();
            const currentRoute: string = window.location.pathname;
            const url: string = element.href.replace(window.location.origin, '');

            if (!url || currentRoute === url.replace('#', '') || url.startsWith('javascript:void(0)')) {
                return;
            }

            await this.openNewRoute(url);
        }
    }

    private async activateRoute(): Promise<void> {
        const urlRoute: string = window.location.pathname;

        const isAuthenticated: string | null = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) as string | null;

        if (!isAuthenticated && !['/login', '/signup'].includes(urlRoute)) {

            history.replaceState({}, '', '/login');
            await this.activateRoute();
            return;
        }

        const oldRoute: RouteType | undefined = this.routes.find(route => route.route === this.currentRoute);
        const newRoute: RouteType | undefined = this.routes.find(item => item.route === urlRoute);

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
                if (this.titlePageEl) this.titlePageEl.innerHTML = newRoute.title;
            }
            if (newRoute.filePathTemplate) {
                let contentBlock: HTMLElement | null = this.contentEl;

                if (newRoute.useLayout) {
                    const layoutHTML: string = await fetch(newRoute.useLayout).then(response => response.text());

                    if (this.contentEl) {
                        this.contentEl.innerHTML = layoutHTML;
                    } else {
                        console.error('contentEl не найден');
                        return;
                    }

                    contentBlock = document.querySelector('#content');
                    if (!contentBlock) {
                        return;
                    }

                    CommonUtils.updateProfileName();
                    await CommonUtils.getBalance()
                }

                const pageHTML: string = await fetch(newRoute.filePathTemplate).then(response => response.text());
                if (contentBlock) {
                    contentBlock.innerHTML = pageHTML;
                } else {
                    console.error('Блок для вставки контента не найден');
                }
            }

            if (newRoute.load && typeof newRoute.load === "function") {
                newRoute.load();
            }
            this.activeNavItem();
        }
    }

    private removeLoadedScripts(): void {
        document.querySelectorAll('script[data-dynamic]').forEach(script => {
            script.remove();
        });
    }

    private activeNavItem(): void {
        const currentPath: string = window.location.pathname;
        const navItemsEl: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('.nav-item a');

        if (!navItemsEl.length) {
            return;
        }

        navItemsEl.forEach(item => item.classList.remove('active'));

        navItemsEl.forEach(item => {
            const href: string | null = item.getAttribute('href');

            if (href && href !== 'javascript:void(0)' && href === currentPath) {
                item.classList.add('active');

                const parentDropdown: HTMLElement | null = item.closest('.dropdown');

                if (parentDropdown) {
                    parentDropdown.classList.add('active');
                    parentDropdown.querySelector('.dropdown-toggle')?.classList.add('active');
                }
            }
        });
    }

}