import fs from 'fs';
let code = fs.readFileSync('src/pages/storefront/Home.tsx', 'utf8');

code = code.replace(
  'overflow-x-auto pb-4 md:pb-0',
  'overflow-x-auto pb-4 md:pb-0 scrollbar-hide'
);

fs.writeFileSync('src/pages/storefront/Home.tsx', code);
