import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import SuccessMessage from '../components/SuccessMessage';
import RegistrationSuccess from '../components/RegistrationSuccess';
import ErrorMessage from '../components/ErrorMessage';

const OtpForm = () => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    // Get email from navigation state or localStorage
    useEffect(() => {
        const locationState = (navigate as any).location?.state;
        const storedEmail = localStorage.getItem('registrationEmail');
        
        if (locationState?.email) {
            setEmail(locationState.email);
            if (locationState.message) {
                setSuccess(locationState.message);
            }
        } else if (storedEmail) {
            setEmail(storedEmail);
        }
    }, [navigate]);

    const handleOtpChange = (index: number, value: string) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Auto-focus to next input
            if (value && index < 3) {
                const nextInput = document.getElementById(`otp-${index + 1}`);
                if (nextInput) nextInput.focus();
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        const otpString = otp.join('');
        if (otpString.length !== 4) {
            setError('Please enter a valid 4-digit OTP');
            setIsLoading(false);
            return;
        }

        if (!email.trim()) {
            setError('Please enter your email address');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/user/verify-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.trim(),
                    otp: otpString
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Account created successfully! Redirecting to login...');
                // Clear stored email
                localStorage.removeItem('registrationEmail');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError(data.message || 'Verification failed');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/register');
    };

    const handleResendOTP = async () => {
        if (!email.trim()) {
            setError('Please enter your email address first');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/api/user/resend-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email.trim() }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('New OTP sent to your email!');
            } else {
                setError(data.message || 'Failed to resend OTP');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Verify Your Email
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter the 4-digit code sent to your email to complete registration
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Enter your email"
                            />
                        </div>

                        {/* OTP Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                OTP Code
                            </label>
                            <div className="flex justify-center space-x-2">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="0"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Error and Success Messages */}
                    {error && (
                        <ErrorMessage 
                            message={error} 
                            onClose={() => setError('')}
                        />
                    )}
                    {success && (
                        success.includes('Registration') || success.includes('updated') ? (
                            <RegistrationSuccess 
                                message={success} 
                                email={email}
                                onClose={() => setSuccess('')}
                            />
                        ) : (
                            <SuccessMessage 
                                message={success} 
                                onClose={() => setSuccess('')}
                            />
                        )
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <LoadingSpinner size="small" color="text-white" />
                                    <span className="ml-2">Verifying...</span>
                                </>
                            ) : (
                                'Verify Email'
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                    </div>

                    {/* Resend OTP Link */}
                    <div className="text-center">
                        <button
                            type="button"
                            onClick={handleResendOTP}
                            disabled={isLoading}
                            className="text-indigo-600 hover:text-indigo-500 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Didn't receive the code? Resend verification email
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OtpForm;