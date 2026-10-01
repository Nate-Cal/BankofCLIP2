import {View} from "../../utils/View.js";

const home = document.querySelector("#transaction-view");
const start = document.querySelector("#home-view");
const view = new View("./views/transaction_center/Transaction.html", home, start);

export function setupTransactionButton() {
    document.querySelector("#transaction_button")
        .addEventListener("click", () => {
            view.navigate().catch(console.error);
        });
}
