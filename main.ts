import path from "path";
import fs from "fs";
import Lexer from "./src/Lexer";
import Parser from "./src/Parser";

let file = process.argv[2];
if(!file) file = "main.mini";

const file_path = path.join(process.cwd(), file);

fs.readFile(file_path, (err, data) => {
    if(err) {
        throw err.message;
    }

    const input = data.toString();

    const parsed_file = path.parse(file_path);

    const lex = new Lexer(input, file_path).tokenize();

    const par = new Parser(lex.getLexed()).parse();

});