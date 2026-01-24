let repos;

function renderNotes() {
    const notes = [{
        path: "/notes/books/sicp",
        name: "SICP - Structure and Interpretation of Computer Programs 2nd Edition"
    }];

    const sections = [
        { title: "Livros", prefix: "/notes/books" }
    ];

    const container = document.getElementById("notes-container");

    const toElement = (route) => (`
        <li>
            <a data-route href="#${route.path}">${route.name}</a>
        </li>
    `);

    const byPathPrefix = (route, section) => (route.path.startsWith(section.prefix));

    const render = () => {
        for (const section of sections) {
            const elements = notes
                .filter((route) => byPathPrefix(route, section))
                .map(toElement)
                .join("");

            if (!elements) return;

            container.innerHTML += `
                <ul>
                    <li>${section.title}: 
                        <ul>${elements}</ul>
                    </li>
                </ul>
            `;
        }
    }

    container.innerHTML = `<h2>Anotações</h2>`;
    render();
}

function renderRepos() {
    const container = document.getElementById("repos-container");

    const toDTO = (repo) => ({
        name: repo["name"],
        url: repo["html_url"],
        description: repo["description"]
    });

    const toElement = (repo) => {
        const description = (repo.description ? `- ${repo.description}` : "");
        return `
            <li>
                <a target="_blank" href="${repo.url}">${repo.name}</a> ${description}
            </li>
        `;
    };

    const render = () => {
        const elements = repos.map(toDTO).map(toElement).join("");
        container.innerHTML = `
            <h2>Repositórios</h2>
            <ul>${elements}</ul>
        `;
    }

    const check = (response) => {
        if (!response.ok)
            throw new Error();

        return response.json();
    }

    if (repos) {
        render();
        return;
    }

    fetch("https://api.github.com/users/bhfsilva/repos?per_page=3&sort=created")
        .then(check)
        .then(data => {
            repos = data;
            render();
        })
        .catch(() => container.remove());
}

export default {
    render() {
        document.body.innerHTML = `
            <section>
                <div id="greetings-container">
                    <h1>Me chamo Bruno Henrique!</h1>
                    <img src="public/images/waving.png"/>
                </div>
                <p>Desenvolvedor back-end.</p>
                <span id="links-container">
                    <span>
                        <a target="_blank" href="mailto:bhfs.contato@gmail.com">
                            <i class="bi bi-envelope-fill"></i>
                            bhfs.contato@gmail.com
                        </a>
                        |
                    </span>
                    <span>
                        <a target="_blank" href="https://linkedin.com/in/bhfsilva">
                            <i class="bi bi-linkedin"></i>
                            Linkedin - Bruno Henrique
                        </a>
                        |
                    </span>
                    <span>
                        <a target="_blank" href="https://github.com/bhfsilva">
                            <i class="bi bi-github"></i>
                            Github - bhfsilva
                        </a>
                    </span>
                </span>
                <div>
                    <a href="#/">
                        <i class="bi bi-download"></i>
                        CV
                    </a>
                </div>
            </section>
            <section id="repos-container">
                <i class="bi bi-arrow-repeat loading-icon"></i>
            </section>
            <section id="notes-container">
                <i class="bi bi-arrow-repeat loading-icon"></i>
            </section>
            <!--
            <pre style="line-height: 23px">
   !      ___ 
   _     /| |)
  ( }    \\| |)
| /\\__,=_[___]_
|_\\__  |--------|
|  |/  |        |
|  /_  |        |
            </pre>
            -->
        `;

        renderNotes();
        renderRepos();
    }
}
