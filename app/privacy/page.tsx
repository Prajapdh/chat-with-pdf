// ./app/privacy/page.tsx

import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <p className="mb-4">Last updated: {new Date().toDateString()}</p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-4">1. Introduction</h2>
      <p className="mb-4">Welcome to ChatPDF. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.</p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-4">2. Information We Collect</h2>
      <p className="mb-4">We collect information you provide directly to us, such as when you create an account, upload PDFs, or communicate with us. This may include your name, email address, and the content of the PDFs you upload.</p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-4">3. How We Use Your Information</h2>
      <p className="mb-4">We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to comply with legal obligations.</p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-4">4. Data Security</h2>
      <p className="mb-4">We implement appropriate technical and organizational measures to protect the security of your personal information.</p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-4">5. Your Rights</h2>
      <p className="mb-4">You have the right to access, correct, or delete your personal information. You may also have the right to object to or restrict certain processing of your data.</p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-4">6. Changes to This Privacy Policy</h2>
      <p className="mb-4">We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-4">7. Contact Us</h2>
      <p className="mb-4">If you have any questions about this Privacy Policy, please contact us at [Your Contact Email].</p>
    </div>
  );
};

export default PrivacyPolicy;
