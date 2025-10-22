import { CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function SuccessMessage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-6" />
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Thank You!
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Your client intake form has been submitted successfully. We'll review your information and get back to you within 2 business days if anything is missing.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            What happens next?
          </h3>
          <ul className="text-left text-blue-800 space-y-2">
            <li>• Our team will review your submission</li>
            <li>• We'll verify all required information</li>
            <li>• You'll receive a confirmation email within 24 hours</li>
            <li>• We'll contact you if additional information is needed</li>
            <li>• Your account will be set up within 2 business days</li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="btn btn-primary inline-flex items-center px-6 py-3"
          >
            Submit Another Form
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>Need help? Contact us at <a href="mailto:support@mnrlk.com" className="text-primary-600 hover:underline">support@mnrlk.com</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
