import { Constructs } from "./Lexer";
import Tokens, { Expressions } from "./tokens";
import { log } from "./utils";

type Expression = {
    type: Expressions;
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

        const expressions: Expression[] = [];

        let expression: Constructs[] = [];
        let currentExpressionType: Expressions | null = null;

        while(this.input.length > 0) {

            const cur = this.input.shift();

            if(cur?.type === Tokens.SEMICOLON) {
                
                currentExpressionType = this.analyzeExpression(expression);

                if(expression.length > 0) {
                    expressions.push({ type: currentExpressionType, value: expression });
                }

                expression = [];
                currentExpressionType = null;
                continue;
            }

            if(!cur) continue;

            expression.push(cur);
            
        }

        return this;

    }

    private analyzeExpression(expression: Constructs[]): Expressions {

        if(expression[0].type === Tokens.LET) {
            
        }

        return Expressions.ERROR;
    }
}