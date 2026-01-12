import Tokens, { skipableToken } from "./tokens";

export default class Lexer {

    public input: string = "";

    constructor(input: string) {
        this.input = input;
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

            default: {
                return Tokens.USER_DEFINED_IDENTIFIER;
            }
        }
    }

    public tokenize() {
        
        let buildable: string = "";
        
        for(let i = 0; i < this.input.length; i++) {
            const char = this.input[i];

            if(skipableToken.includes(char)) {
                if(buildable != "") {
                    this.decideIdentifierMeaning(buildable);
                }
            }

            if(this.isLetter(char)) {
                buildable += char;
            }
        }
    }
}