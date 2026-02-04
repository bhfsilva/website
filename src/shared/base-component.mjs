import { createLinkElement } from "../utils/html.mjs";

export class BaseComponent extends HTMLElement {
    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: "open" });
    }

    styles = "";
    html = "";

    element = undefined;

    #loadDefaultStyles() {
        const source = document.head.querySelector("#default-style").href;
        const link = createLinkElement(source);
        if (link)
            this._shadow.appendChild(link);
    }

    #setStyles() {
        const style = document.createElement("style");
        style.textContent = this.styles;
        this._shadow.appendChild(style);
    }

    #setHtml() {
        const template = document.createElement("template");
        template.innerHTML = this.html.trim();
        const element = template.content.firstElementChild;
        this.element = this._shadow.appendChild(element);
    }

    includeIcons() {
        const source = document.head.querySelector("#icons").href;
        const link = createLinkElement(source);
        if (link)
            this._shadow.appendChild(link);
    }

    select(selector) {
        const element = this._shadow.querySelector(selector);
        if (!element)
            return;

        return element;
    }

    selectAll(selector) {
        const elements = this._shadow.querySelectorAll(selector);
        if (!elements)
            return;

        return Array.from(elements);
    }

    connectedCallback() {
        this.#setHtml();
        this.#setStyles();
        this.#loadDefaultStyles();
    }
}
