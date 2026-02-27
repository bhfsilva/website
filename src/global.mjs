import registerComponents from "./components/index.mjs";
import loadLocale from "./services/i18n/index.mjs";
import storage from "./services/storage/index.mjs";
import { getTranslatableElements } from "./utils/document.mjs";

if (location.pathname.includes("index.html"))
    location.pathname = location.pathname.replace("index.html", "");

HTMLElement.prototype.replaceText = function(value) {
    const textNode = (child) => (child.nodeType === Node.TEXT_NODE);
    const node = Array.from(this.childNodes).find(textNode);

    if (node) {
        node.nodeValue = value;
        return;
    }

    this.textContent = value;
};

const setDefaultText = (element) => element.replaceText("...");
getTranslatableElements().forEach(setDefaultText);

document.documentElement.lang = storage.getLocale();
document.body.dataset.theme = storage.getTheme();

registerComponents();
loadLocale();