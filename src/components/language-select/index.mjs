import { BaseComponent } from "../../shared/base-component.mjs";

export class LanguageSelect extends BaseComponent {
    constructor() {
        super();
    }

    static ID = "language-select";

    styles =  (`
        details {
            position: relative;
            margin-top: -5px;
        }

        summary {
            align-items: center;
            cursor: pointer;
            display: flex;
            gap: 0.5rem;
        }

        summary #chevron {
            font-size: calc(var(--font-size) + 3px);
            transition: transform 0.2s ease;
            line-height: 0px;
        }

        details[open] summary #chevron {
            transform: rotate(90deg);
        }

        fieldset {
            background-color: rgba(30, 30, 30, 0.9);
            flex-direction: column;
            border: 2px solid gray;
            border-radius: 3px;
            position: absolute;
            display: flex;
            width: 100%;
            top: 35px;
            gap: 3px;
        }

        label {
            justify-content: center;
            display: inline-flex;
            cursor: pointer;
            padding: 10px;
            gap: 10px;
        }

        input {
            display: none;
        }
    `);

    html = (`
        <details>
            <summary></summary>
            <fieldset></fieldset>
        </details>
    `);

    #options = [
        { value: "pt-BR", icon: "fi fi-br" },
        { value: "en-US", icon: "fi fi-us" }
    ];

    #includeFlagIcons() {
        const link = document.head.querySelector("#flag-icons");
        if (link)
            this._shadow.appendChild(link.cloneNode(true));
    }

    #getOptionsElements() {
        const options = Array.from(this.selectAll("input"));
        const currentLanguage = document.documentElement.lang;

        const setProperties = (element) => {
            const byValue = (option) => (option.value == element.value);
            const { value, icon } = this.#options.find(byValue);

            element.icon = icon;
            element.checked = (value === currentLanguage);
        };

        options.forEach(setProperties);
        return options;
    }

    #getSelectedOptionElement() {
        const selected = (option) => (option.checked);
        return this.#getOptionsElements().find(selected);
    }

    #renderSelectedOption() {
        const icon = this.#getSelectedOptionElement().icon;
        this.select("summary").innerHTML = `
            <i id="chevron" class="bi bi-chevron-right"></i>
            <i class="${icon}"></i>
        `;
    }

    #renderOptions() {
        const container = this.select("fieldset");
        const render = (option) => {
            container.innerHTML += `
                <label>
                    <input type="radio" value="${option.value}" name="language">
                    <i class="${option.icon}"></i>
                </label>
            `
        };
        this.#options.forEach(render);
    }

    connectedCallback() {
        super.connectedCallback();

        this.includeIcons();
        this.#includeFlagIcons();

        this.#renderOptions();
        this.#renderSelectedOption();

        const selectLanguage = (event) => {
            const option = event.target;
            const previousOption = this.#getSelectedOptionElement();

            if (option === previousOption) {
                this.element.open = false;
                return;
            }

            document.documentElement.lang = option.value;
            window.dispatchEvent(new Event("languagechange"));
        };

        this.#getOptionsElements().forEach(option => {
            option.addEventListener("click", selectLanguage);
        });

        const close = (event) => {
            const isOutside = (event.target.localName !== LanguageSelect.ID);
            if (isOutside)
                this.element.open = false;
        };
        document.addEventListener("pointerdown", close);
    }
}
