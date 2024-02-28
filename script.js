const allButtonElements = document.querySelectorAll('.button');
const displayMainText = document.getElementById('display-main-text');
const displaySecondaryText = document.getElementById('display-secondary-text');
const clearButton = document.getElementById('clear');

const VALID_OPERATORS = [
    {
        name: "add",
        symbol: "+"
    },
    {
        name: "subtract",
        symbol: "-"
    },
    {
        name: "multiply",
        symbol: "×"
    },
    {
        name: "divide",
        symbol: "/"
    },
];

const calculation = {
    number1 : 0,
    operator : "",
    number2 : 0,
    result: 0,
    isAwaitingInput: true,
    hasNum1FromPreviousResult: false,
}

const MAX_STRING_LENGTH = 8;
const allButtons = Array.from(allButtonElements);

let mainString = "0";
let secondaryString = "";



document.addEventListener('click', (event) => {
    const buttonName = event.target.name;
    const buttonValue = event.target.value;

    switch (buttonName) {
        case "number":
            addNumberToMainString(buttonValue);
            break;
        case "numberModifier":
            mainString = modifyMainStringNumber(mainString, buttonValue);
            break;
        case "operator":
            prepareOperation(buttonValue);
            break;
        case "equals":
            if ( !calculation.isAwaitingInput ) processCalculation();
            break;
        case "clear":
            clearScreen();
    }

    displayMainText.innerText = mainString;
    displaySecondaryText.innerText = secondaryString;
})


const addNumberToMainString = (numStr) => {
    if (mainString === "0" && numStr == "0" && !mainString.includes(".")) return;
    if (numStr === "." && mainString.includes(".")) return;
    if (calculation.isAwaitingInput) initializeMainNumber(numStr);
    else if (mainString.length < MAX_STRING_LENGTH) mainString += numStr;
}


const initializeMainNumber = (numStr) => {
    mainString = numStr
    calculation.hasNum1FromPreviousResult = false
    calculation.isAwaitingInput = false
    clearButton.innerText = 'C';
}


const modifyMainStringNumber = (str, modifier) => {
    switch (modifier) {
        case "negate":
            if (str === '0' || calculation.isAwaitingInput) return str
            else if ( str.includes("-") ) return str.slice(1, str.length);
            else return  str = `-${str}`;
        case "togglePercent":
            if ( str.includes("%") ) return str.slice(0, str.length - 1);
            else return `${str}%`;
    }
}


const prepareOperation = (operator) => {
    const fullEquation = /\d+\s*[+-×/]\s*\d+/

    if (secondaryString === "" || fullEquation.test(secondaryString)) secondaryString = `${mainString} ${convertOperatorToSymbol(operator)}`
    else secondaryString += ` ${mainString}`

    if ( !calculation.hasNum1FromPreviousResult ) calculation.number1 = stringToNum(mainString)
    
    calculation.operator = operator
    calculation.isAwaitingInput = true
}


const processCalculation = () => {
    calculation.number2 = stringToNum(mainString);
    calculation.result = calculate()
    secondaryString += ` ${mainString}`
    mainString = adjustLength(calculation.result)

    resetCalculation(calculation.result)
    calculation.isAwaitingInput = true;
}

const calculate = (num1=calculation.number1, operator=calculation.operator, num2=calculation.number2) => {
    switch (operator) {
        case "add":
            return num1 + num2;
        case "subtract":
            return num1 - num2;
        case "multiply":
            return num1 * num2;
        case "divide":
            if (num2 !== 0) return num1 / num2;
        default:
            return 0;         
    }
}

const clearScreen = () => {
    if (mainString === '0') {
        resetCalculation();
        secondaryString = "";
    }
    else mainString = '0';
    clearButton.innerText = 'AC';
}

const stringToNum = (str) => {
    if (str.includes("%")) {
        const cleanStr = str.slice(0, mainString.length - 1);
        return parseFloat(cleanStr) * 0.01;
    } 
    else return parseFloat(str);
}

const convertOperatorToSymbol = (name) => {
    if (typeof name !== "string") return ""

    for (operatorObject of VALID_OPERATORS) {
        if (operatorObject.name === name) return operatorObject.symbol;
    }  
}

const adjustLength = (num, maxLength=MAX_STRING_LENGTH) => {
    if (num.toString().length <= maxLength) return num.toString()

    console.log("too long")
    if (num.toExponential().toString().length <= maxLength) return num.toExponential().toString();
    
    const exponentialStrings = num.toExponential().toString().split("e");
    let baseStr = exponentialStrings[0]
    let expStr = exponentialStrings[1]

    if (expStr.includes("+")) expStr = expStr.slice(1, expStr.length);

    baseStr = baseStr.slice(0, maxLength - 1 - expStr.length)
    
    return `${baseStr}e${expStr}`;
    
}

const resetCalculation = (newNumber1=0) => {
    calculation.number1 = newNumber1
    calculation.operator = ""
    calculation.number2 = 0
    calculation.result = 0
    calculation.isAwaitingInput = true

    if (newNumber1 !== 0) calculation.hasNum1FromPreviousResult = true;
    else calculation.hasNum1FromPreviousResult = false;
}