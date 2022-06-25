export default class ConsoleManager {
    static console = [""];
    static lastInput = "";
    static listening = false;
    
    static addToConsole(string, ctx) {



        this.console.push(string);   
    }

    // static wordWrap(ctx, text, maxWidth) {

    //     let strarr = [];
    //     let stringBuilder = "";
    //     let broken = text.split(" ");
    //     for (let s of broken) {
    //       let width = ctx.measureText(stringBuilder + s).width;
    //       if (width < maxWidth) {
    //         stringBuilder += s;
    //       } else {
    //         stringBuilder += s;
    //         strarr.push(stringBuilder);
    //         stringBuilder = "";
    //       }
    //     }
    //     strarr.push(stringBuilder);
    //     return strarr;
    // }
}