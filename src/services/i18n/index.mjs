import { getResourcesAbsolutePath } from "../../utils/document.mjs";
import storage from "../storage/index.mjs";

function getPageLocale() {
    const getLocale = (properties) => {
        const [ pageProperties, globalProperties ] = properties;

        const mergeProperties = (map, key) => {
            map[key] = { ...globalProperties[key], ...pageProperties[key] };
            return map;
        };

        const localeProperties = (
            Object
                .keys({ ...pageProperties, ...globalProperties })
                .reduce(mergeProperties, {})
        );

        let language = storage.getLocale();

        const exists = localeProperties.hasOwnProperty(language);
        if (!exists)
            language = "pt-BR";

        return localeProperties[language];
    };

    const pageProperties = getResourcesAbsolutePath().pageLocaleProperties;
    const globalProperties = getResourcesAbsolutePath().global.localeProperties;

    const parse = (response) => (response.ok ? response.json() : {});
    const fetchProperty = (url) => (fetch(url).then(parse).catch(() => ({})));

    const fetchProperties = () => (
        Promise.all([
            fetchProperty(pageProperties),
            fetchProperty(globalProperties)
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
