import Tokens, { skipableToken } from "./tokens";
import { log } from "./utils";

export type Constructs = {
    type: Tokens;
    value: string;
}

export default class Lexer {

    public input: string = "";
    public constructs: Constructs[] = [];
    public file_name: string = "";

    constructor(input: string, file_name: string) {
        this.input = input;
        this.file_name = file_name;
    }

    private isLetter(char: string): boolean {
        if(char.toUpperCase() != char.toLowerCase()) {
            return true;
        }

        return false;
    }

    private isNumeric(char: string): boolean {
        if(!isNaN(parseInt(char))) {
            return true
        }
        
        return false;
    }

    private isSymbol(char: string): boolean {
        if(!this.isNumeric(char) && !this.isLetter(char)) {
            return true;
        }

        return false;
    }

    private decideIdentifierMeaning(identifier: string): Tokens {
        

        switch (identifier) {
            case "func": {
                return Tokens.FUNC;                
            }
            
            case "let": {
                return Tokens.LET;
            }

            case "if": {
                return Tokens.IF;
            }

            case "el": {
                return Tokens.EL;
            }

            case "elif": {
                return Tokens.ELIF;
            }

            case "ret": {
                return Tokens.RET;
            }

            case "for": {
                return Tokens.FOR;
            }

            case "out": {
                return Tokens.OUT;
            }

            case "+": {
                return Tokens.PLUS;
            }

            case "-": {
                return Tokens.MINUS;
            }

            case "*": {
                return Tokens.MULTI;
            }

            case "/": {
                return Tokens.DEV;
            }

            case "(": {
                return Tokens.LEFT_BRACE;
            }

            case ")": {
                return Tokens.RIGHT_BRACE;
            }

            case "{": {
                return Tokens.LEFT_CURLY;
            }

            case "}": {
                return Tokens.RIGHT_CURLY;
            }

            case ">": {
                return Tokens.MORE;
            }

            case "<": {
                return Tokens.LESS;
            }

            case "#": {
                return Tokens.COMMENT;
            }

            case "=": {
                return Tokens.EQUAL;
            }

            case '"': {
                return Tokens.QOUTE;
            }

            default: {
                return Tokens.USER_DEFINED_IDENTIFIER;
            }
        }
    }

    private constructToken(token: string) {
        const type = this.decideIdentifierMeaning(token);
        this.constructs.push({ type, value: token });
    }

    public tokenize(): Lexer {
        let buildable = "";
        let lastBuildableType: "str" | "num" | null = null;
        
        for(let i = 0; i < this.input.length; i++) {
            const char = this.input[i];

            if(skipableToken.includes(char)) {
                if(buildable != "") {
                    this.constructToken(buildable);
                    buildable = "";
                }
                continue;
            }

            if(this.isLetter(char)) {

                if(lastBuildableType != "str" && buildable != "") {
                    this.constructToken(buildable);
                    buildable = "";
                }

                buildable += char;
                lastBuildableType = "str";
            } else if(this.isNumeric(char)) {

                if(lastBuildableType != "num"  && buildable != "") {
                    this.constructToken(buildable);
                    buildable = "";
                }

                buildable += char;
                lastBuildableType = "num";
            } else if(this.isSymbol(char)) {

                if(buildable != "") {
                    this.constructToken(buildable);
                    buildable = "";
                }

                this.constructToken(char);
            }
        }

        log("success", "tokenized", this.file_name);

        this.finilize();

        return this;
    }

    private finilize() {
        
        let finalized: Constructs[] = [];

        while(this.constructs.length > 0) {
            const cur = this.constructs.shift();
            if(!cur) continue;

            if(cur.type === Tokens.MORE && this.constructs[0]?.type === Tokens.MORE) {
                this.constructs.shift();
                finalized.push({ type: Tokens.PIPE, value: ">>" });
                continue;     
            }

            if(cur.type === Tokens.DEV && this.constructs[0]?.type === Tokens.DEV) {
                this.constructs.shift();
                finalized.push({ type: Tokens.COMMENT, value: "//" });
                continue;
            }

            if(cur.type === Tokens.QOUTE) {
                let str = "";
                while(this.constructs[0]?.type !== Tokens.QOUTE) {
                    str += this.constructs.shift()?.value;
                }
                this.constructs.shift();
                finalized.push({ type: Tokens.STRING, value: str });
                continue;
            }

            if(cur.type === Tokens.USER_DEFINED_IDENTIFIER) {
                if(this.isNumeric(cur.value)) {
                    finalized.push({ type: Tokens.NUMBER, value: cur.value });
                    continue;
                }
            }

            finalized.push(cur);
        }

        this.constructs = finalized;

        log("success", "finilized", this.file_name);
    }

    public getLexed() {
        return this.constructs;
    }
}