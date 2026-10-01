import {View} from "../../utils/View.js";
import {setupTransactionButton} from "../transaction_center/Transaction.js";

const home = document.querySelector("#home-view");
const start = document.querySelector("#start-view");
const view = new View("./views/dashboard/Home.html", home, start);

const buttons = document.querySelectorAll(".homeButton");
buttons.forEach(button =>
    button.addEventListener("click", async () => {
        try {
            await view.navigate();
            setupTransactionButton();
        } catch (error) {
            console.error(error);
        }
    })
);
