import { Constructs } from "./Lexer";
import Tokens, { Expressions } from "./tokens";
import { log } from "./utils";

type ExpressionDeclaration = {
    type: Expressions,
    value: Array<Constructs | ExpressionDeclaration> | string,
    data: {
        [key: string]: any
    }
}

export default class Parser {
    
    private input: Constructs[];

    private file_name: string = "";

    public expressions: ExpressionDeclaration[] = [];
    
    constructor(input: Constructs[], file_name: string) {

        this.file_name = file_name;

        this.input = input;

    }

    public parse(): Parser {

        log("info", "Parsing...", this.file_name);

        let expression: Constructs[] = [];
        let currentExpressionType: ExpressionDeclaration | null = null;

        const blocks: ExpressionDeclaration[] = [];

        while(this.input.length > 0) {

            const cur = this.input.shift();

            if(!cur) continue;

            if(cur.type === Tokens.LEFT_CURLY) {
                blocks.push({
                    type: Expressions.CODE_BLOCK,
                    value: [],
                    data: {}
                });
                continue;
            }

            if(cur.type === Tokens.RIGHT_CURLY) {
                const error = {
                    type: Expressions.ERROR,
                    value: [],
                    data: {
                        "message": ""
                    }
                }

                
                if(blocks.length === 0) {
                    error.data["message"] = "Unexpected closing brace, found \"" + cur.value + "\" in " + this.file_name;
                    this.error(error.data["message"]);

                    continue;
                }

                if(blocks.length === 1) {
                    const block = blocks.pop();

                    error.data["message"] = "This error should not be possible, I have no idea how you got here";
                    if(!block) {
                        this.error(error.data["message"]);
                        continue;
                    }

                    this.expressions.push(block);
                    continue;
                } 

                const block = blocks.pop();

                if(!block) {
                    error.data["message"] = "This error should not be possible, I have no idea how you got here";
                    this.error(error.data["message"]);
                    continue;
                }

                (blocks[blocks.length - 1].value as ExpressionDeclaration[]).push(block);

                continue;

            }

            if(cur.type === Tokens.SEMICOLON) {
                
                currentExpressionType = this.analyzeExpression(expression);

                if(expression.length > 0) {
                    if(blocks.length > 0) {
                        (blocks[blocks.length - 1].value as ExpressionDeclaration[]).push(currentExpressionType);
                    } else this.expressions.push(currentExpressionType);
                }

                expression = [];
                currentExpressionType = null;
                continue;
            }

            expression.push(cur);
            
        }

        return this;

    }

    private structureValues(values: Constructs[]): string {
        
        let string = "";
        
        for(let i = 0; i < values.length; i++) {
            if(values[i].type === Tokens.STRING) {
                string += '"' + values[i].value + '"';
            } else {
                string += values[i].value;
            }

            if(i < values.length - 1) string += " ";
        }

        return string;
    }

    private analyzeExpression(expression: Constructs[]): ExpressionDeclaration {

        const error = {
            type: Expressions.ERROR,
            value: [],
            data: {
                "message": ""
            }
        }

        switch (expression[0].type) {
            case Tokens.LET: {
                if(expression[1].type !== Tokens.USER_DEFINED_IDENTIFIER) this.error("Expected UDI after let, found \"" + expression[1].value + "\" in " + this.file_name);
                if(expression[2].type !== Tokens.ASSIGN) this.error("Expected \"=\" after UDI in LET expression, found \"" + expression[2].value + "\" in " + this.file_name);

                const value = this.analyzeExpression(expression.slice(3));

                if(value.type === Expressions.ERROR || (value.type !== Expressions.STRING && value.type !== Expressions.MATH_EXPRESSION)) this.error(value.data["message"] + " in " + this.file_name);
                
                const out: ExpressionDeclaration = {
                    type: Expressions.VARIABLE_DECLARATION,
                    value: [value],
                    data: {
                        "reference": expression[1].value 
                    }
                }

                return out;
            }

            case Tokens.STRING: {
                if(expression.length === 1) {

                    const out: ExpressionDeclaration = {
                        type: Expressions.STRING,
                        value: expression[0].value,
                        data: {}
                    }

                    return out;
                }

                error.data["message"] = "Invalid string expression: " + "'" + this.structureValues(expression) + "'";

                return error;
            }

            case Tokens.NUMBER: {
                error.data["message"] = "Invalid math expression: " + "'" + this.structureValues(expression) + "'";
                if(expression[expression.length-1].type !== Tokens.NUMBER) return error;
                
                let operatorActive: boolean = false;
                
                for(let i = 1; i < expression.length-1; i++) {
                    if(expression[i].type !== Tokens.PLUS && expression[i].type !== Tokens.MINUS && expression[i].type !== Tokens.MULTI && expression[i].type !== Tokens.DEV && expression[i].type !== Tokens.NUMBER) {
                        
                        error.data["message"] = "Invalid math expression: " + "'" + this.structureValues(expression) + "'";

                        return error;
                    }

                    if(expression[i].type === Tokens.PLUS || expression[i].type === Tokens.MINUS || expression[i].type === Tokens.MULTI || expression[i].type === Tokens.DEV) {
                        
                        error.data["message"] = "Invalid math expression: " + "'" + this.structureValues(expression) + "'";
                        if(operatorActive) return error;

                        operatorActive = true;
                    } else {
                        operatorActive = false;
                    }
                }

                const out: ExpressionDeclaration = {
                    type: Expressions.MATH_EXPRESSION,
                    value: expression,
                    data: {}
                }

                return out;
            }
        }

        error.data["message"] = "Invalid expression: " + "'" + this.structureValues(expression) + "'";

        return error;
    }

    private error(message: string) {
        log("error", message);
        process.exit(1);
    }
}