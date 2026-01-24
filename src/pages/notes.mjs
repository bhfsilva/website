import { getLocation } from "../router.mjs";
import notesContentSource from "../../data/notes-source.mjs";

const HTMLParser = new DOMParser();
const markdownParser = new marked.Marked()
    .use(markedFootnote())
    .use(markedGfmHeadingId.gfmHeadingId())
    .use(markedKatex({ nonStandard: true }))
    .use(markedDirective.createDirectives());

const contentRoot = "https://raw.githubusercontent.com/bhfsilva/anotacoes/refs/heads/main";
const internalPaths = Object.keys(notesContentSource);

let cache = {};

function getPathBySource(source) {
    return internalPaths.find((path) => (notesContentSource[path] === source));
}

function focusById(id) {
    id = decodeURI(id?.replace("#", ""));
    if (!id) {
        window.scrollTo({ top: 0 });
        return;
    }

    const element = document.getElementById(id);
    if (!element)
        return;

    element.scrollIntoView({ block: "start" });
    element.focus({ preventScroll: true });
}

function renderMarkdownPage(url) {
    const currentPath = url.internal.path;
    const contentURL = `${contentRoot}/${notesContentSource[currentPath]}`;

    const cachePageContent = cache[currentPath];
    if (cachePageContent) {
        document.body.innerHTML = cachePageContent;
        return;
    }

    const format = (markdown) => {
        const frontmatter = /^-{3}.*?-{3}/s;
        const markdownBlockId = /\s\^(.+-ref)$/gm;

        const toDirectiveBlockId = (_, id) => (`{#${id}}`);

        return markdown
            .replace(frontmatter, "")
            .replace(markdownBlockId, toDirectiveBlockId);
    }

    const toHTML = (markdown) => {
        const resolveLink = (link) => {
            const isExternalLink = (link.origin != url.origin);
            if (isExternalLink) {
                link.target = "_blank";
                return;
            }

            const isFootnoteLink = link.id.includes("footnote-ref");
            if (isFootnoteLink)
                link.textContent = `[${link.textContent}]`;

            let href = `${url.internal.origin}#${url.internal.path}`;

            const linkSource = link.pathname.replace(url.pathname, "");
            const linkInternalPath = getPathBySource(linkSource);
            if (linkInternalPath)
                href = `${url.internal.origin}#${linkInternalPath}`;

            const getCustomHeadingAnchor = (link) => {
                const invalidHeaderChars = /[.()^]/g;
                return decodeURI(link.hash)
                    .toLowerCase()
                    .replaceAll(" ", "-")
                    .replace(invalidHeaderChars, "");
            }

            const hash = getCustomHeadingAnchor(link);
            link.hash = "";

            if (hash)
                href += hash;

            link.href = href;
            return link;
        }

        const resolveType = (blockquote) => {
            const firstChild = blockquote.firstElementChild;
            const text = firstChild.textContent;

            const quoteTypeRegex = /\[!(.+)\]/g;
            const type = quoteTypeRegex.exec(text)?.[1];

            let content = text.replace(quoteTypeRegex, "").trim();

            if (!type)
                return;

            if (!content)
                content = type.toUpperCase();

            blockquote.setAttribute("data-type", type);

            const color = window.getComputedStyle(blockquote).getPropertyValue("--color");
            firstChild.style.color = `rgb(${color})`;
            firstChild.style.fontWeight = "bold";

            const icon = window.getComputedStyle(blockquote).getPropertyValue("--icon");
            if (!icon) {
                firstChild.textContent = content;
                return;
            }

            firstChild.innerHTML = `
                <i class="bi bi-${icon.replaceAll("'", "")}"></i> ${content}
            `;
        }

        const html = HTMLParser.parseFromString(markdownParser.parse(markdown), "text/html");
        html.querySelectorAll("a").forEach(resolveLink);
        html.querySelectorAll("blockquote").forEach(resolveType);

        return html;
    }

    const renderNavBar = () => {
        const currentIndex = internalPaths.indexOf(currentPath);

        const previousPath = (currentIndex === 0)
            ? undefined
            : internalPaths.at(currentIndex - 1);

        const nextPath = (currentIndex + 1) === (internalPaths.length - 1)
            ? undefined
            : internalPaths.at(currentIndex + 1);

        const toLink = (path, label) => {
            if (!path)
                return "<span></span>";

            return `<a href="#${path}">${label}</a>`;
        }

        return `
            <nav class="note-navbar">
                ${toLink(previousPath, "<< prev")}
                <a href="#/">[home]</a>
                ${toLink(nextPath, "next >>")}
            </nav>
        `;
    }

    const check = (response) => {
        if (!response.ok)
            throw new Error();

        return response.text();
    }

    const render = (data) => {
        const markdown = format(data);
        const html = toHTML(markdown);

        const pageContent = `
            ${renderNavBar()}
            ${html.body.innerHTML}
            ${renderNavBar()}
        `;

        document.body.innerHTML = pageContent;
        focusById(url.internal.hash);

        cache = {};
        cache[currentPath] = pageContent;
    }

    fetch(contentURL)
        .then(check)
        .then(render)
        .catch(() => location.replace("#/404"));
}

export default {
    render() {
        const url = getLocation();
        renderMarkdownPage(url);
        focusById(url.internal.hash);
    }
}
