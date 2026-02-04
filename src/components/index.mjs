import { LoadingSpinner } from "./loading-spinner/index.mjs";
import { ThemeSwitcher } from "./theme-switcher/index.mjs";
import { LanguageSelect } from "./language-select/index.mjs";

const registry = {
    [LanguageSelect.ID]: LanguageSelect,
    [LoadingSpinner.ID]: LoadingSpinner,
    [ThemeSwitcher.ID]: ThemeSwitcher
};

function bind([id, component]) {
    window.customElements.define(id, component);
}

export default function registerComponents() {
    Object.entries(registry).forEach(bind);
}
