import { getLocation } from "../../utils/document.mjs";
import storage from "../storage/index.mjs";

function getPageLocale() {
    const getLocale = (module) => {
        const properties = module.default;
        let language = storage.getLocale();

        const exists = properties.hasOwnProperty(language);
        if (!exists)
            language = "pt-BR";

        return properties[language];
    };

    const properties = `../../../pages/${getLocation().internal.pagename}/data/i18n-properties.mjs`;

    const check = () => {
        return fetch(properties, { method: "HEAD" })
    };

    const get = (response) => {
        if (!response.ok)
            return undefined;

        return import(properties).then(getLocale);
    };
    
    return check().then(get);
}

export default function changeLocale() {
    const translate = (locale) => {
        if (!locale)
            return;

        const replaceText = (element) => {            
            const textNode = (child) => (child.nodeType === Node.TEXT_NODE);

            const value = locale[element.dataset.locale];
            const node = Array.from(element.childNodes).find(textNode);
            if (node) {
                node.nodeValue = value;
                return;
            }

            element.textContent = value;
        };

        Array.from(document.querySelectorAll("[data-locale]")).forEach(replaceText);
    };

    getPageLocale().then(translate);
}
