enum Tokens {
    FUNC = "FUNC",
    LET = "LET",
    RET = "RET",
    IF = "IF",
    EL = "EL",
    ELIF = "ELIF",
    FOR = "FOR",
    OUT = "OUT",

    PLUS = "PLUS",
    MINUS = "MINUS",
    MULTI = "MULTI",
    DEV = "DEV",
    ASSIGN = "ASSIGN",

    QOUTE = 'QOUTE',

    SEMICOLON = "SEMICOLON",

    LEFT_BRACE = "LEFT_BRACE",
    RIGHT_BRACE = "RIGHT_BRACE",

    LEFT_CURLY = "LEFT_CURLY",
    RIGHT_CURLY = "RIGHT_CURLY",

    MORE = "MORE",
    LESS = "LESS",
    EQUAL = "EQUAL",

    PIPE = "PIPE",

    COMMENT = "COMMENT",

    USER_DEFINED_IDENTIFIER = "UDI",

    STRING = "STRING",
    NUMBER = "NUMBER",

}

enum Expressions {

    VARIABLE_DECLARATION = "VARIABLE_DECLARATION",
    FUNCTION_CALL = "FUNCTION_CALL",
    FUNCTION_DECLARATION = "FUNCTION_DECLARATION",
    IF_STATEMENT = "IF_STATEMENT",
    FOR_STATEMENT = "FOR_STATEMENT",
    RETURN_STATEMENT = "RETURN_STATEMENT",
    PIPE = "PIPE",
    STRING = "STRING",
    MATH_EXPRESSION = "MATH_EXPRESSION",
    CODE_BLOCK = "CODE_BLOCK",

    ERROR = "ERROR"

}

export { Expressions };

export const skipableToken = ["", " ", "\n", "\r"];

export default Tokens;