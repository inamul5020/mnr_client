import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, UserPlus, Users, BarChart3, Copy, Eye, EyeOff, Mail, Key, User } from 'lucide-react';

interface UserCredentials {
  username: string;
  password: string;
  email: string;
}

export function StaffSuccessPage() {
  const [credentials, setCredentials] = useState<UserCredentials | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Get credentials from session storage
    const storedCredentials = sessionStorage.getItem('staffCredentials');
    if (storedCredentials) {
      setCredentials(JSON.parse(storedCredentials));
      // Clear from session storage
      sessionStorage.removeItem('staffCredentials');
    }
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendCredentials = () => {
    if (credentials) {
      const subject = 'Your MNR Associates System Access Credentials';
      const body = `Hello,

Your user account has been created successfully. Here are your login credentials:

Username: ${credentials.username}
Password: ${credentials.password}
Email: ${credentials.email}

Please log in to the system and change your password on first login.

Best regards,
MNR Associates Team`;

      const mailtoLink = `mailto:${credentials.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Staff Member Created Successfully!</h1>
        <p className="text-gray-600 mt-2">
          The new staff member has been added to the system
        </p>
      </div>

      {/* User Credentials Card */}
      {credentials && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-lg font-medium text-blue-900">
                User Account Created
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                A user account has been automatically created with the following credentials:
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {/* Username */}
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <label className="text-sm font-medium text-gray-700">Username</label>
                    <p className="text-lg font-mono text-gray-900">{credentials.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(credentials.username)}
                  className="text-blue-600 hover:text-blue-700 p-2 rounded-md hover:bg-blue-100"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Password */}
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Key className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <p className="text-lg font-mono text-gray-900">
                      {showPassword ? credentials.password : '••••••••••••'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-600 hover:text-gray-700 p-2 rounded-md hover:bg-gray-100"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(credentials.password)}
                    className="text-blue-600 hover:text-blue-700 p-2 rounded-md hover:bg-blue-100"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-lg text-gray-900">{credentials.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(credentials.email)}
                  className="text-blue-600 hover:text-blue-700 p-2 rounded-md hover:bg-blue-100"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Copy All Button */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => copyToClipboard(`Username: ${credentials.username}\nPassword: ${credentials.password}\nEmail: ${credentials.email}`)}
              className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 flex items-center"
            >
              <Copy className="h-4 w-4 mr-2" />
              {copied ? 'Copied!' : 'Copy All Credentials'}
            </button>
          </div>

          {/* Send Email Button */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={sendCredentials}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center"
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Credentials via Email
            </button>
          </div>
        </div>
      )}

      {/* Important Notes */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-medium text-yellow-900 mb-3">Important Notes</h3>
        <ul className="text-sm text-yellow-800 space-y-2">
          <li className="flex items-start">
            <span className="text-yellow-600 mr-2">•</span>
            <span>Please provide these credentials to the staff member securely</span>
          </li>
          <li className="flex items-start">
            <span className="text-yellow-600 mr-2">•</span>
            <span>Staff member should change their password on first login</span>
          </li>
          <li className="flex items-start">
            <span className="text-yellow-600 mr-2">•</span>
            <span>Account permissions can be modified by administrators later</span>
          </li>
          <li className="flex items-start">
            <span className="text-yellow-600 mr-2">•</span>
            <span>Keep these credentials secure and do not share them publicly</span>
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/staff/new"
          className="px-6 py-3 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 flex items-center justify-center"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Add Another Staff Member
        </Link>
        
        <Link
          to="/staff"
          className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-center"
        >
          <Users className="h-5 w-5 mr-2" />
          View Staff List
        </Link>
        
        <Link
          to="/admin"
          className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-center"
        >
          <BarChart3 className="h-5 w-5 mr-2" />
          Go to Dashboard
        </Link>
      </div>

      {/* Auto-redirect notice */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          You will be redirected to the staff list in 30 seconds...
        </p>
      </div>
    </div>
  );
}
