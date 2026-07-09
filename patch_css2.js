import fs from 'fs';
let code = fs.readFileSync('src/index.css', 'utf8');

code = code.replace(
  'overscroll-behavior-y: none;',
  'overscroll-behavior-y: none;\n    overflow-x: hidden;'
);

fs.writeFileSync('src/index.css', code);
