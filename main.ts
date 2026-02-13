import path from "path";
import fs from "fs";
import Lexer from "./src/Lexer";
import Parser from "./src/Parser";
import { log } from "./src/utils";

let file = process.argv[2];
if(!file) file = "main.mini";

const file_path = path.join(process.cwd(), file);

fs.readFile(file_path, (err, data) => {
    if(err) {
        log("error", err.message);
        process.exit(1);
    }

    const input = data.toString();

    const parsed_file = path.parse(file_path);

    const lex = new Lexer(input, file_path).tokenize();

    const par = new Parser(lex.getLexed(), file_path).parse();

    log("info", "\n", JSON.stringify(par.expressions, null, 2));

});