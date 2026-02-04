import { BaseComponent } from "../../shared/base-component.mjs";

export class ThemeSwitcher extends BaseComponent {
    constructor() {
        super();
    }

    static ID = "theme-switcher";

    styles =  (`
        button {
            font-size: calc(var(--font-size) + 10px);
            color: var(--text-color);
            border-radius: 90px;
            background: none;
            padding: 3px 5px;
        }
    `);

    html = (`
        <button>
            <i></i>
        </button>
    `);

    #isDark() {
        return (document.body.dataset.theme === "dark");
    }

    #renderIcon() {
        this.select("i").className = (this.#isDark()) ? "bi bi-sun" : "bi bi-moon"
    }

    connectedCallback() {
        super.connectedCallback();

        this.includeIcons();
        this.#renderIcon();

        const switchTheme = () => {
            document.body.dataset.theme = this.#isDark() ? "light" : "dark";
            this.#renderIcon();
        }

        this.element.addEventListener("click", switchTheme);
    }
}
