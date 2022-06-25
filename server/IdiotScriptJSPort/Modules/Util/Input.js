export default class Input {
    value = "";
    inputElement;
    formElement;
    result;
    onClick;
    constructor (x, y, width, height, result, options) {
        this.result = result;

        if (options == undefined) {
            this.inputElement = document.createElement("input");
        } else {
            this.inputElement = document.createElement("select");
        }

        this.formElement = document.createElement("form")
        this.inputElement.autocomplete = "off";
        this.formElement.style.position = "absolute";

        this.formElement.style.cssText += `
            margin: 0;
            ${x};
            ${y};
        `

        this.inputElement.style.cssText += `
            text-decoration: none;
            width: ${width}px;
            height: ${height}px;

            border: none;
            outline: none;
            background-color: rgb(116, 116, 116);
            color: white;
        `

        this.formElement.appendChild(this.inputElement);
        document.body.appendChild(this.formElement);


        if (options != undefined)
        for (let option of options) {
            let optionElement = document.createElement("option");
            optionElement.value = option;
            optionElement.innerText = option;
            this.inputElement.appendChild(optionElement);
        }
        
        this.onClick = function blur() {
            this.inputElement.blur();
        }

        this.formElement.addEventListener("submit", (e) => {
            e.preventDefault();
            this.result(e);
          })

        document.getElementById('main').addEventListener('mousedown', () => {
            this.onClick();
        })
    }

    remove() {
        document.getElementById('main').removeEventListener('mousedown', this.onClick);
        this.formElement.remove();
    }
}