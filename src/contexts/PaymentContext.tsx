import React, { createContext, useContext, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";



interface CardDetails {
  lastFour: string;
  expiryMonth: string;
  expiryYear: string;
  brand: string;
}

interface PaymentContextType {
  savedCard: CardDetails | null;
  setSavedCard: (card: CardDetails | null) => void;
  processPayment: (amount: number, description: string) => Promise<boolean>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider = ({children}: {children: React.ReactNode}) => {

  const [savedCard, setSavedCard] = useState<CardDetails | null>(null);

  const { user } = useAuth();


  const processPayment = async (
    amount: number,
    description: string
  ): Promise<boolean> => {
    console.log("Processing payment of $", amount, "Description:", description);
  
    if (!user) {
      toast.error("User is not authenticated");
      return false;
    }
  
    try {
      const { data, error } = await supabase.functions.invoke(
        "create-checkout-session",
        {
          body: {
            featureType: "show_more_info",
            amount,
            description,
          },
        }
      );
  
      if (error) throw error;
      if (!data?.url) throw new Error("No checkout URL received");
  
      // Redirect to Stripe checkout
      window.location.href = data.url;
  
      return true;
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Payment failed. Please try again.");
      return false;
    }
  };
  

  return (
    <PaymentContext.Provider value={{ savedCard, setSavedCard, processPayment }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
};
