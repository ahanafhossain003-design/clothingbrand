import fs from 'fs';
let code = fs.readFileSync('src/components/Layout.tsx', 'utf8');

code = code.replace(
  'className={cn("min-h-screen flex flex-col", isDarkMode ? "dark" : "")}',
  'className={cn("min-h-screen flex flex-col max-w-[100vw] overflow-x-hidden", isDarkMode ? "dark" : "")}'
);

fs.writeFileSync('src/components/Layout.tsx', code);
