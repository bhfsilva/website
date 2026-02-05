import i18nProperties from "../data/i18n-properties.mjs";

const locale = {
    get: function(key) {
        let language = document.documentElement.lang;

        const exists = i18nProperties.hasOwnProperty(language);
        if (!exists)
            language = "pt-BR";

        return i18nProperties[language][key];
    }
};

export default locale;
