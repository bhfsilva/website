import storage from "../storage/index.mjs";
// import properties from "./properties.mjs";

function get(key) {
    let language = storage.getLocale();
    const exists = properties.hasOwnProperty(language);
    if (!exists)
        language = "pt-BR";

    return properties[language][key];
}

export default function changeLocale() {
    const translate = (element) => {
        const byTextNodes = (child) => (child.nodeType === Node.TEXT_NODE);
        const content = get(element.dataset.locale);

        const nodes = Array.from(element.childNodes).filter(byTextNodes);
        if (!nodes.length) {
            element.textContent = content;
            return;
        }

        const text = nodes[0];
        text.nodeValue = content;
    };

    Array.from(document.querySelectorAll("[data-locale]")).forEach(translate);
}
