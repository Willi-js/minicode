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

    public tokenize() {
        for(let i = 0; i < this.input.length; i++) {
            const char = this.input[i];


        }
    }
}