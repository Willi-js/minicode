enum Tokens {
    FUNC,
    LET,
    RET,
    IF,
    EL,
    ELIF,
    FOR,
    OUT,

    PLUS,
    MINUS,
    MULTI,
    DEV,
    ASSIGN,

    QOUTE,

    SEMICOLON,

    LEFT_BRACE,
    RIGHT_BRACE,

    LEFT_CURLY,
    RIGHT_CURLY,

    MORE,
    LESS,
    EQUAL,

    PIPE,

    COMMENT,

    USER_DEFINED_IDENTIFIER,

    STRING,
    NUMBER,

}

enum Expressions {

    VARIABLE_DECLARATION,
    FUNCTION_CALL,
    FUNCTION_DEFINITION,
    IF_STATEMENT,
    FOR_STATEMENT,
    RETURN_STATEMENT,
    PIPE,

    ERROR

}

export { Expressions };

export const skipableToken = ["", " ", "\n", "\r"];

export default Tokens;