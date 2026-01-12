import path from "path";
import fs from "fs";
import Lexer from "./src/Lexer";

let file = process.argv[2];
if(!file) file = "main.mini";

fs.readFile(path.join(process.cwd(), file), (err, data) => {
    if(err) {
        throw err.message;
    }

    const input = data.toString();

    const lex = new Lexer(input);

    lex.tokenize();

});