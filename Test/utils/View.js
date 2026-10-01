export class View {
    constructor(viewLocation, open, close) {
        this.viewLocation = viewLocation;
        this.open = open;
        this.close = close;
    }

    async navigate() {
        const response = await fetch(this.viewLocation);
        const html = await response.text();
        this.open.innerHTML = html;
        //maybe check if close is undefined before setting this
        this.close.hidden = true;
    }
    // maybe add setters for open and close
}
