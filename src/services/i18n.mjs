const locale = {
    get: function(key) {
        let language = document.documentElement.lang;

        const exists = this.hasOwnProperty(language);
        if (!exists)
            language = "pt-BR";

        return this[language][key];
    },
    "pt-BR": {
        "greetings": "Me chamo Bruno Henrique!",
        "role": "Desenvolvedor Back-end.",
        "repos-title": "Repositórios",
        "see-more": "Ver mais...",
        "notes-title": "Anotações",
        "books-title": "Livros",
        "notes-lang-hint": "Apenas em"
    },
    "en-US": {
        "greetings": "I'm Bruno Henrique!",
        "role": "Back-end developer.",
        "repos-title": "Repositories",
        "see-more": "See more...",
        "notes-title": "Notes",
        "books-title": "Books",
        "notes-lang-hint": "Only in"
    }
};

export default locale;
