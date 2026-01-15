import { Constructs } from "./Lexer";
import Tokens, { Expressions } from "./tokens";
import { log } from "./utils";

type Expression = {
    type: Expression;
    value: Constructs[] | Expression[]
}

export default class Parser {
    
    private input: Constructs[];
    
    constructor(input: Constructs[]) {

        this.input = input;

    }

    public parse(): Parser {

        const expressions = []

        while(this.input.length > 0) {
            const cur = this.input.shift();
            
        }

        return this;

    }
}