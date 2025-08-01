import React from 'react';

interface RegistrationSuccessProps {
  message: string;
  email: string;
  onClose?: () => void;
}

const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({ message, email, onClose }) => {
  return (
    <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md text-sm">
      <div className="flex items-start">
        <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <div className="flex-1">
          <p className="font-medium">{message}</p>
          <p className="text-blue-600 mt-1">
            Check your email at <span className="font-semibold">{email}</span> for the verification code.
          </p>
          <p className="text-blue-600 mt-1 text-xs">
            The code will expire in 10 minutes.
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-blue-700 hover:text-blue-900 ml-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default RegistrationSuccess; 