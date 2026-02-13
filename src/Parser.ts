import { Constructs } from "./Lexer";
import Tokens, { Expressions } from "./tokens";
import { log } from "./utils";

type Expression = {
    type: Expressions;
    value: Array<Expression | Constructs>
}

export default class Parser {
    
    private input: Constructs[];

    private file_name: string = "";

    public expressions: Expression[] = [];
    
    constructor(input: Constructs[], file_name: string) {

        this.file_name = file_name;

        this.input = input;

    }

    public parse(): Parser {

        log("info", "Parsing...", this.file_name);

        let expression: Constructs[] = [];
        let currentExpressionType: [Expressions, Array<Expression | Constructs>] | null = null;

        while(this.input.length > 0) {

            const cur = this.input.shift();

            if(cur?.type === Tokens.SEMICOLON) {
                
                currentExpressionType = this.analyzeExpression(expression);

                if(expression.length > 0) {
                    this.expressions.push({ type: currentExpressionType[0], value: currentExpressionType[1] });
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

    private structureValues(values: Constructs[]): string {
        
        let string = "";
        
        for(let i = 0; i < values.length; i++) {
            string += values[i].value;
        }

        return string;
    }

    private analyzeExpression(expression: Constructs[]): [Expressions, Array<Expression | Constructs>] {

        switch (expression[0].type) {
            case Tokens.LET: {
                if(expression[1].type !== Tokens.USER_DEFINED_IDENTIFIER) this.error("Expected UDI after let, found \"" + expression[1].value + "\" in " + this.file_name);
                if(expression[2].type !== Tokens.ASSIGN) this.error("Expected \"=\" after UDI in LET expression, found \"" + expression[2].value + "\" in " + this.file_name);

                const value = this.analyzeExpression(expression.slice(3));

                if(value[0] === Expressions.ERROR || (value[0] !== Expressions.STRING && value[0] !== Expressions.MATH_EXPRESSION)) this.error("Expected a valid expression or value after \"=\" in LET expression, found \"" + this.structureValues(expression.slice(3)) + "\" in " + this.file_name);
                
                return [Expressions.VARIABLE_DECLARATION, value[1]];
            }
            case Tokens.STRING: {
                if(expression.length === 1) {
                    return [Expressions.STRING, expression];
                }

                return [Expressions.ERROR, []];
            }

            case Tokens.NUMBER: {
                if(expression[expression.length-1].type !== Tokens.NUMBER) return [Expressions.ERROR, []];
                
                let operatorActive: boolean = false;
                
                for(let i = 1; i < expression.length-1; i++) {
                    if(expression[i].type !== Tokens.PLUS && expression[i].type !== Tokens.MINUS && expression[i].type !== Tokens.MULTI && expression[i].type !== Tokens.DEV && expression[i].type !== Tokens.NUMBER) {
                        return [Expressions.ERROR, []];
                    }

                    if(expression[i].type === Tokens.PLUS || expression[i].type === Tokens.MINUS || expression[i].type === Tokens.MULTI || expression[i].type === Tokens.DEV) {
                        if(operatorActive) return [Expressions.ERROR, []];
                        operatorActive = true;
                    } else {
                        operatorActive = false;
                    }
                }
                return [Expressions.MATH_EXPRESSION, expression];
            }
        }

        return [Expressions.ERROR, []];
    }

    private error(message: string) {
        log("error", message);
        process.exit(1);
    }
}