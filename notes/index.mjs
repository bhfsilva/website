import { focusById, getLocation } from "../src/utils/dom.mjs";
import sources from "./source.mjs";

let cache = {};
const internalPaths = Object.keys(sources);

const HTMLParser = new DOMParser();
const markdownParser = new marked.Marked()
    .use(markedFootnote())
    .use(markedGfmHeadingId.gfmHeadingId())
    .use(markedKatex({ nonStandard: true }))
    .use(markedDirective.createDirectives());

function getPathBySource(source) {
    return internalPaths.find((path) => (sources[path] === source));
}

function render(content) {
    const internal = getLocation().internal;
    document.body.innerHTML = content;
    focusById(internal.hash);
    document.title = "bhfsilva/notes" + internal.hashpath;
}

function renderNotFound() {
    render(`<not-found-snippet></not-found-snippet>`);
}

function renderMarkdownPage() {
    const url = getLocation();

    const currentPath = url.internal.hashpath;
    const source = sources[currentPath];

    if (!source) {
        renderNotFound();
        return;
    }

    const cacheContent = cache[currentPath];
    if (cacheContent) {
        render(cacheContent);
        return;
    }

    const format = (markdown) => {
        const frontmatter = /^-{3}.*?-{3}/s;
        const markdownBlockId = /\s\^(.+-ref)$/gm;

        const directiveBlockId = (_, id) => (`:{#${id}}`);

        return markdown
            .replace(frontmatter, "")
            .replace(markdownBlockId, directiveBlockId);
    }

    const toHTML = (markdown) => {
        const resolveQuoteType = (blockquote) => {
            const firstChild = blockquote.firstElementChild;
            const text = firstChild.textContent;

            const quoteTypeRegex = /\[!(.+)\]/g;

            const type = quoteTypeRegex.exec(text)?.[1];
            if (!type)
                return;

            let content = text.replace(quoteTypeRegex, "").trim();
            if (!content)
                content = type.toUpperCase();

            blockquote.setAttribute("data-type", type);

            const css = window.getComputedStyle(blockquote);
            const color = css.getPropertyValue("--color");

            firstChild.style.color = `rgb(${color})`;
            firstChild.style.fontWeight = "bold";   

            const icon = css.getPropertyValue("--icon");
            if (!icon) {
                firstChild.textContent = content;
                return;
            }

            firstChild.innerHTML = `
                <i class="bi bi-${icon.replaceAll("'", "")}"></i> ${content}
            `;
        }

        const resolveLink = (link) => {
            const isExternalLink = (link.origin != url.origin);
            if (isExternalLink) {
                link.target = "_blank";
                return;
            }

            const isFootnoteLink = link.id.includes("footnote-ref");
            if (isFootnoteLink)
                link.textContent = `[${link.textContent}]`;

            const getHref = (link) => {
                const origin = url.internal.origin;
                const root = url.pathname;

                const source = link.pathname.replace(root, "");
                const path = getPathBySource(source);
                if (path)
                    return `${origin}#${path}`;

                return `${origin}#${url.internal.hashpath}`;
            }

            const getHeadingAnchor = (link) => {
                const invalidChars = /[.()^]/g;
                return decodeURI(link.hash)
                    .toLowerCase()
                    .replaceAll(" ", "-")
                    .replace(invalidChars, "");
            }

            link.href = (getHref(link) + getHeadingAnchor(link));
            return link;
        }

        const html = HTMLParser.parseFromString(markdownParser.parse(markdown), "text/html");
        html.querySelectorAll("blockquote").forEach(resolveQuoteType);
        html.querySelectorAll("a").forEach(resolveLink);

        return html;
    }

    const renderNavBar = () => {
        const currentIndex = internalPaths.indexOf(currentPath);

        const previousPath = (currentIndex === 0)
            ? undefined : internalPaths.at(currentIndex - 1);

        const nextPath = (currentIndex + 1) === (internalPaths.length - 1)
            ? undefined : internalPaths.at(currentIndex + 1);

        const createLink = (path, icon) => {
            if (!path)
                return "<span></span>";

            return `
                <a href="#${path}">
                    <i class="bi bi-${icon} link-icon"></i>
                </a>
            `;
        }

        return `
            <nav id="note-navbar">
                ${createLink(previousPath, "arrow-left")}
                <a href="#/books/sicp"><i class="bi bi-list link-icon"></i></a>
                ${createLink(nextPath, "arrow-right")}
            </nav>
        `;
    }

    const check = (response) => {
        if (!response.ok)
            throw new Error();

        return response.text();
    }

    const build = (data) => {
        const markdown = format(data);
        const html = toHTML(markdown);

        const content = `
            <div>
                <theme-switcher></theme-switcher>
                <a href=".."><i class="bi bi-house-door link-icon"></i></a>
            </div>
            ${renderNavBar()}
            ${html.body.innerHTML}
            ${renderNavBar()}
        `;

        cache = {};
        cache[currentPath] = content;

        render(content);
    }

    fetch(`https://raw.githubusercontent.com/bhfsilva/anotacoes/refs/heads/main/${source}`)
        .then(check)
        .then(build)
        .catch(() => renderNotFound());
}

window.addEventListener("hashchange", renderMarkdownPage);

renderMarkdownPage();
