import globalLocaleProperties from "../../shared/global-i18n-properties.mjs";
import { getResourcesAbsolutePath } from "../../utils/document.mjs";
import storage from "../storage/index.mjs";

let pageLocale;

function getPageLocale() {
    if (pageLocale)
        return pageLocale;

    const getLocale = (properties = {}) => {
        const getProperties = () => {
            const merge = (map, key) => {
                map[key] = { ...globalLocaleProperties[key], ...properties[key] };
                return map;
            };

            const allProperties = { ...globalLocaleProperties, ...properties };
            return Object.keys(allProperties).reduce(merge, {})
        };

        return getProperties();
    };

    const loadPageLocale = (module) => getLocale(module.default);
    const localeProperties = getResourcesAbsolutePath().pageLocaleProperties;

    pageLocale = import(localeProperties).then(loadPageLocale).catch(getLocale);
    return pageLocale;
}

export default function loadLocale() {
    const translate = (locale) => {
        let language = storage.getLocale();

        const exists = locale.hasOwnProperty(language);
        if (!exists)
            language = "pt-BR";

        const replaceText = (element) => {            
            const textNode = (child) => (child.nodeType === Node.TEXT_NODE);

            const node = Array.from(element.childNodes).find(textNode);
            const value = locale[language][element.dataset.locale];
            
            if (node) {
                node.nodeValue = value;
                return;
            }

            element.textContent = value;
        };

        Array
            .from(document.querySelectorAll("[data-locale]"))
            .forEach(replaceText);
    };

    getPageLocale().then(translate);
}
