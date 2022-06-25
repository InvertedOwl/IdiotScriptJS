export default class VariableManager {
    static variableList = {};
    // static arrays = {};
    constructor() {
    }
    static newVar(name, initialValue) {
        VariableManager.variableList[name] = initialValue;
    }
    static setVar(name, val) {
        VariableManager.variableList[name] = val;
    }
    static removeVar(name) {
        delete VariableManager.variableList[name];
    }
    static getVar(name) {
        return VariableManager.variableList[name];
    }
}