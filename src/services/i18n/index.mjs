import { getResourcesAbsolutePath, getTranslatableElements } from "../../utils/document.mjs";
import globalLocaleProperties from "../../shared/global-i18n-properties.mjs";
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
            const value = locale[language][element.dataset.locale];
            element.replaceText(value);
        };

        getTranslatableElements().forEach(replaceText);
    };

    getPageLocale().then(translate);
}
