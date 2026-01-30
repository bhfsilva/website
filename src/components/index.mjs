import { ThemeSwitcher } from "./theme-switcher/index.mjs";

const registry = {
    [ThemeSwitcher.ID]: ThemeSwitcher
};

function bind([id, component]) {
    window.customElements.define(id, component);
}

export function registerComponents() {
    Object.entries(registry).forEach(bind);
}
