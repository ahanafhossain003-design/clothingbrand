import React from 'react';

export default function StaticPages({ page }: { page: 'about' | 'contact' | 'faq' | 'privacy' | 'return' }) {
  const content = {
    about: {
      title: "About Aurelia",
      body: "Aurelia was born from a singular vision: to redefine modern luxury by combining timeless design principles with uncompromising craftsmanship. Founded in 2026, we curate collections that transcend fleeting trends, offering our clientele pieces that are as enduring as they are elegant. Every garment is a testament to our dedication to quality, sourced from the finest materials and constructed with meticulous attention to detail."
    },
    contact: {
      title: "Contact Us",
      body: "We are here to assist you with any inquiries regarding our collections, your orders, or our services.\n\nEmail: clientcare@aurelia.com\nPhone: +1 (800) 123-4567\n\nBoutique Hours:\nMonday - Saturday: 10:00 AM - 8:00 PM\nSunday: 11:00 AM - 6:00 PM"
    },
    faq: {
      title: "Frequently Asked Questions",
      body: "Q: Do you ship internationally?\nA: Yes, we offer complimentary worldwide shipping on all orders over $500.\n\nQ: How can I track my order?\nA: Once your order is dispatched, you will receive an email containing your tracking information.\n\nQ: What payment methods do you accept?\nA: We accept all major credit cards, Mobile Banking (bKash, Nagad) via Advance Payment, and Cash on Delivery for select regions."
    },
    privacy: {
      title: "Privacy Policy",
      body: "At Aurelia, we deeply respect your privacy. This policy outlines how we collect, use, and protect your personal information. We ensure that all transactions are secured using industry-standard encryption, and your data is never sold to third parties."
    },
    return: {
      title: "Returns & Exchanges",
      body: "We want you to be completely satisfied with your purchase. Aurelia accepts returns of unworn, unwashed, and undamaged merchandise within 30 days of delivery. Custom or personalized items are final sale. To initiate a return, please contact our client care team."
    }
  };

  const currentContent = content[page];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-[60vh]">
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl font-bold uppercase tracking-wider mb-4">{currentContent.title}</h1>
        <div className="w-16 h-1 bg-gold-500 mx-auto" />
      </div>
      <div className="prose dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:text-gray-600 dark:prose-p:text-gray-300 whitespace-pre-line text-center">
        {currentContent.body}
      </div>
    </div>
  );
}
