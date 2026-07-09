import fs from 'fs';
let code = fs.readFileSync('src/pages/storefront/ProductView.tsx', 'utf8');

code = code.replace(
  'className="flex md:flex-col gap-4 order-2 md:order-1 overflow-x-auto md:overflow-y-auto"',
  'className="flex md:flex-col gap-4 order-2 md:order-1 overflow-x-auto md:overflow-y-auto scrollbar-hide"'
);

fs.writeFileSync('src/pages/storefront/ProductView.tsx', code);
