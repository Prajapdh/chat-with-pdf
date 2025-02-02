// ./app/terms/page.tsx

import React from 'react';

const TermsOfService = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <p className="mb-4">Last updated: {new Date().toDateString()}</p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-4">1. Acceptance of Terms</h2>
      <p className="mb-4">By accessing or using ChatPDF, you agree to be bound by these Terms of Service.</p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-4">2. Description of Service</h2>
      <p className="mb-4">ChatPDF provides a platform for users to upload and interact with PDF documents using AI-powered chat functionality.</p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-4">3. User Responsibilities</h2>
      <p className="mb-4">You are responsible for your use of the service and for any content you provide, including compliance with applicable laws, rules, and regulations.</p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-4">4. Intellectual Property Rights</h2>
      <p className="mb-4">The service and its original content, features, and functionality are owned by ChatPDF and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-4">5. Limitation of Liability</h2>
      <p className="mb-4">In no event shall ChatPDF, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.</p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-4">6. Governing Law</h2>
      <p className="mb-4">These Terms shall be governed and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.</p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-4">7. Changes to Terms</h2>
      <p className="mb-4">We reserve the right, at our sole discretion, to modify or replace these Terms at any time.</p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-4">8. Contact Us</h2>
      <p className="mb-4">If you have any questions about these Terms, please contact us at [Your Contact Email].</p>
    </div>
  );
};

export default TermsOfService;
