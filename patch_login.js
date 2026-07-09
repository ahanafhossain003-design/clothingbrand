import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/AdminLogin.tsx', 'utf8');

const hookSearch = `  const { loginAdmin, isAdminAuthenticated, isDarkMode } = useAppStore();`;
const hookReplace = `  const { loginAdmin, isAdminAuthenticated, isDarkMode, adminPhone, setAdminPhone } = useAppStore();
  const [phone, setPhone] = useState(adminPhone || '');`;

code = code.replace(hookSearch, hookReplace);

const submitSearch = `    if (email === 'xyz000@gmail.com' && password === '000111222') {
      loginAdmin();
      navigate('/admin');
    } else {
      setError('Invalid email or password');
    }`;
const submitReplace = `    if (email === 'xyz000@gmail.com' && password === '000111222') {
      loginAdmin();
      if (phone) {
        setAdminPhone(phone);
      }
      navigate('/admin');
    } else {
      setError('Invalid email or password');
    }`;

code = code.replace(submitSearch, submitReplace);

const inputSearch = `          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-black dark:text-white mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border border-gray-300 dark:border-gray-800 text-black dark:text-white px-4 py-3 focus:outline-none focus:border-gold-500 transition-colors text-sm"
              placeholder="••••••••"
            />
          </div>`;
          
const inputReplace = `          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-black dark:text-white mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border border-gray-300 dark:border-gray-800 text-black dark:text-white px-4 py-3 focus:outline-none focus:border-gold-500 transition-colors text-sm"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-black dark:text-white mb-2">Notification Number (Optional)</label>
            <input 
              type="text" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-transparent border border-gray-300 dark:border-gray-800 text-black dark:text-white px-4 py-3 focus:outline-none focus:border-gold-500 transition-colors text-sm"
              placeholder="+880..."
            />
            <p className="text-[10px] text-gray-500 mt-2">Enter your WhatsApp number to receive new order notifications.</p>
          </div>`;

code = code.replace(inputSearch, inputReplace);

fs.writeFileSync('src/pages/admin/AdminLogin.tsx', code);
