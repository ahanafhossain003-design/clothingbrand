const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/AdminProducts.tsx', 'utf8');

const sizeChartUpload = `
  const handleSizeChartUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, sizeChartImage: reader.result as string }));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };
`;

code = code.replace("const handleSubmit = (e: React.FormEvent) => {", sizeChartUpload + "  const handleSubmit = (e: React.FormEvent) => {");
fs.writeFileSync('src/pages/admin/AdminProducts.tsx', code);
