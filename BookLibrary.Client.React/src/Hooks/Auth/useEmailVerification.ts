import { useState } from 'react';
import { toast } from 'react-toastify';
import useFetch from '../useFetch';

interface UseEmailVerificationProps {
  email: string;
}

const useEmailVerification = ({ email }: UseEmailVerificationProps) => {
  const [isResending, setIsResending] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(0);

  const { fetchData, error} = useFetch()

  const resendVerificationEmail = async () => {
    if (resendCooldown > 0) return;
    
    setIsResending(true);
    try {
      // Replace with your actual API endpoint
      await fetchData(`AuthApi/resend-verification-email`, {
        method: "POST",
        data: { email }
      });
      
      setResendCount(prev => prev + 1);
      toast.success("Verification email sent successfully!");
      
      // Set cooldown timer (60 seconds)
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error) {
      console.error('Failed to resend verification email:', error);
      toast.error("Failed to send verification email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return {
    isResending,
    resendCount,
    resendCooldown,
    resendVerificationEmail
  };
};

export default useEmailVerification;