import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importSearch = `import AdminBanners from './pages/admin/AdminBanners';`;
const importReplace = `import AdminBanners from './pages/admin/AdminBanners';\nimport AdminSettings from './pages/admin/AdminSettings';`;
code = code.replace(importSearch, importReplace);

const routeSearch = `<Route path="banners" element={<AdminBanners />} />`;
const routeReplace = `<Route path="banners" element={<AdminBanners />} />\n          <Route path="settings" element={<AdminSettings />} />`;
code = code.replace(routeSearch, routeReplace);

fs.writeFileSync('src/App.tsx', code);
