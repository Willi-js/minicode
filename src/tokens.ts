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
    EQUAL,

    QOUTE,

    LEFT_BRACE,
    RIGHT_BRACE,

    LEFT_CURLY,
    RIGHT_CURLY,

    MORE,
    LESS,

    PIPE,

    COMMENT,

    USER_DEFINED_IDENTIFIER,

    STRING,
    NUMBER,

    
}

export const skipableToken = ["", " ", "\n", "\r"];

export default Tokens;