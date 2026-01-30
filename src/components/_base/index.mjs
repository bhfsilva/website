export class BaseComponent extends HTMLElement {
    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: "open" });
    }

    get styles() {
        return "";
    }

    get html() {
        return "";
    }

    #element;

    #loadDefaultStyles() {
        const link = document.createElement("link");
        link.href = document.head.querySelector("#default-style").href;
        link.rel = "stylesheet";
        this._shadow.appendChild(link);
    }

    #setStyles(styles) {
        const style = document.createElement("style");
        style.textContent = styles;
        this._shadow.appendChild(style);
    }

    #setHtml(html) {
        const template = document.createElement("template");
        template.innerHTML = html.trim();
        const element = template.content.firstElementChild;
        this.#element = this._shadow.appendChild(element);
    }

    getHTMLElement() {
        return this.#element;
    }

    includeIcons() {
        const source = document.head.querySelector("#bootstrap-icons")?.href;
        if (!source)
            return;

        const link = document.createElement("link");
        link.href = source;
        link.rel = "stylesheet";
        this._shadow.appendChild(link);
    }

    select(selector) {
        const element = this._shadow.querySelector(selector);
        if (element)
            return element;

        return undefined;
    }

    connectedCallback() {
        this.#setStyles(this.styles);
        this.#loadDefaultStyles();
        this.#setHtml(this.html);
    }
}
