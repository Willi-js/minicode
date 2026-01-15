import { Constructs } from "./Lexer";
import Tokens, { Expressions } from "./tokens";
import { log } from "./utils";

type Expression = {
    type: Expression;
    value: Constructs[] | Expression[]
}

export default class Parser {
    
    private input: Constructs[];

    private file_name: string = "";
    
    constructor(input: Constructs[], file_name: string) {

        this.file_name = file_name;

        this.input = input;

    }

    public parse(): Parser {

        log("info", "Parsing...", this.file_name);

        const expressions = []

        while(this.input.length > 0) {
            const cur = this.input.shift();
            
        }

        return this;

    }
}