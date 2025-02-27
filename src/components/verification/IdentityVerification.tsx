import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const IdentityVerification = () => {
  const { user } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyIdentity = async () => {
    if (!user) {
      toast.error("You need to be logged in to verify your identity.");
      return;
    }

    setIsVerifying(true);
    try {
      const response = await supabase.functions.invoke("persona-verification", {
        body: { user_id: user.id },
      });

      if (response.error) throw response.error;

      const { inquiryUrl } = response.data;
      window.location.href = inquiryUrl;
    } catch (error) {
      console.error("Error starting verification:", error);
      toast.error("Failed to start verification. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex justify-center">
      <Button 
        onClick={handleVerifyIdentity} 
        disabled={isVerifying}
        className="px-6 py-3 text-lg"
      >
        {isVerifying ? "Verifying..." : "Verify Your Identity"}
      </Button>
    </div>
  );
};

export default IdentityVerification;
