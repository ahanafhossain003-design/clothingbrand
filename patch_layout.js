import fs from 'fs';
let code = fs.readFileSync('src/components/admin/AdminLayout.tsx', 'utf8');

const navItemsSearch = `    { name: 'Banners', path: '/admin/banners', icon: Image },
  ];`;
const navItemsReplace = `    { name: 'Banners', path: '/admin/banners', icon: Image },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];`;

code = code.replace(navItemsSearch, navItemsReplace);
fs.writeFileSync('src/components/admin/AdminLayout.tsx', code);
