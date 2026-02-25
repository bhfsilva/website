import globalLocaleProperties from "../../shared/global-i18n-properties.mjs";
import { getResourcesAbsolutePath } from "../../utils/document.mjs";
import storage from "../storage/index.mjs";

function getPageLocale() {
    const getLocale = (properties) => {
        const [ pageProperties ] = properties;

        const mergeProperties = (map, key) => {
            map[key] = { ...globalLocaleProperties[key], ...pageProperties[key] };
            return map;
        };

        const localeProperties = (
            Object
                .keys({ ...pageProperties, ...globalLocaleProperties })
                .reduce(mergeProperties, {})
        );

        let language = storage.getLocale();

        const exists = localeProperties.hasOwnProperty(language);
        if (!exists)
            language = "pt-BR";

        return localeProperties[language];
    };

    const pageProperties = getResourcesAbsolutePath().pageLocaleProperties;

    const parse = (response) => (response.ok ? response.json() : {});
    const fetchProperty = (url) => (fetch(url).then(parse).catch(() => ({})));

    const fetchProperties = () => (
        Promise.all([
            fetchProperty(pageProperties)
        ])
    );

    return fetchProperties().then(getLocale);
}

export default function loadLocale() {
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
