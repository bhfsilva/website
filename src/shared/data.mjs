import { getResourcesAbsolutePath } from "../utils/document.mjs";

const { imagesFolder } = getResourcesAbsolutePath().global;

export const notesSections = [
    {
        localeKey: "books-title",
        links: [
            {
                slug: "SICP",
                hashpath: "#/books/sicp",
                image: `${imagesFolder}/books/sicp.jpg`,
                name: "Structure and Interpretation of Computer Programs 2nd Edition"
            }
        ]
    }
];
