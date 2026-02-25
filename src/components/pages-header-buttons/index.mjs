import { getResourcesAbsolutePath } from "../../utils/document.mjs";
import BaseComponent from "../base-component.mjs";

const index = getResourcesAbsolutePath().indexPage;

export class PagesHeaderButtons extends BaseComponent {
    constructor() {
        super();
    }

    static ID = "pages-header-buttons";

    html = (`
        <div class="flex-between">
            <a href="${index}" class="link-icon"><i class="bi bi-house-door"></i></a>
            <language-select></language-select>
            <theme-switcher></theme-switcher>
        </div>
    `);

    connectedCallback() {
        super.connectedCallback();
    }
}
