import fs from 'fs';
let code = fs.readFileSync('src/store/index.ts', 'utf8');

const interfaceSearch = `  isAdminAuthenticated: boolean;`;
const interfaceReplace = `  adminPhone?: string;\n  setAdminPhone: (phone: string) => void;\n  isAdminAuthenticated: boolean;`;

code = code.replace(interfaceSearch, interfaceReplace);

const implSearch = `  isAdminAuthenticated: false,`;
const implReplace = `  adminPhone: '',\n      setAdminPhone: (phone) => set({ adminPhone: phone }),\n      isAdminAuthenticated: false,`;

code = code.replace(implSearch, implReplace);
fs.writeFileSync('src/store/index.ts', code);
