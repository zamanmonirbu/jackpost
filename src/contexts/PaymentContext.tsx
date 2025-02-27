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

    console.log("Processing payment of $", amount, "using card:", savedCard,"kljasdfdf",user);


    // if (!savedCard) {
    //   toast.error("Please add a payment method in billing settings");
    //   return false;
    // }

    try {
      // Simulated payment processing

      //  try {
            const response = await supabase.functions.invoke('create-checkout-session', {
              body: { featureType: 'show_more_info' },
            });
      
            if (response.error) throw response.error;
            if (!response.data?.url) throw new Error('No checkout URL received');
      
            window.location.href = response.data.url;
          // } catch (error) {
          //   console.error('Error setting up payment method:', error);
          //   toast.error('Failed to set up payment method');
          // }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(`Payment of $${amount} processed successfully`);
      return true;
    } catch (error) {
      toast.error("Payment failed. Please try again.");
      return false;
    }
  };

  return (
    <PaymentContext.Provider
      value={{ savedCard, setSavedCard, processPayment }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  console.log()
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
};
