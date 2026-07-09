import fs from 'fs';
let code = fs.readFileSync('src/pages/storefront/Checkout.tsx', 'utf8');

const hookSearch = `  const { cart, products, addOrder, clearCart } = useAppStore();`;
const hookReplace = `  const { cart, products, addOrder, clearCart, adminPhone } = useAppStore();`;
code = code.replace(hookSearch, hookReplace);

const submitSearch = `    setIsSuccess(true);
    
    // Defer clearing the cart so local state update has time to process,
    // avoiding the useEffect navigating back to cart.
    setTimeout(() => {
      clearCart();
    }, 10);
    setTimeout(() => {
      navigate('/');
    }, 5000);
  };`;

const submitReplace = `    setIsSuccess(true);
    
    if (adminPhone) {
      let waMessage = \`New Order Received!\\n\\nCustomer: \${formData.fullName}\\nPhone: \${formData.mobileNumber}\\nAddress: \${formData.fullAddress}\\n\\nItems:\\n\`;
      orderItems.forEach(item => {
        waMessage += \`- \${item.productName} (\${item.quantity}x) \${item.size ? \`[Size: \${item.size}] \` : ''}\${item.color ? \`[Color: \${item.color}] \` : ''}- \${formatCurrency(item.price * item.quantity)}\\n\`;
      });
      waMessage += \`\\nTotal: \${formatCurrency(total)}\\nPayment: \${paymentMethodType === 'COD' ? 'COD' : paymentProvider}\`;
      
      const cleanPhone = adminPhone.replace(/[^0-9]/g, '');
      const waUrl = \`https://wa.me/\${cleanPhone}?text=\${encodeURIComponent(waMessage)}\`;
      window.open(waUrl, '_blank');
    }

    // Defer clearing the cart so local state update has time to process,
    // avoiding the useEffect navigating back to cart.
    setTimeout(() => {
      clearCart();
    }, 10);
    setTimeout(() => {
      navigate('/');
    }, 5000);
  };`;

code = code.replace(submitSearch, submitReplace);
fs.writeFileSync('src/pages/storefront/Checkout.tsx', code);
