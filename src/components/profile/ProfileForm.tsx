import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck, Building2, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BillingSection from "./BillingSection";
import TwoFactorAuth from "./TwoFactorAuth";
import { usePremiumFeatures } from "@/contexts/PremiumFeaturesContext";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export const ProfileForm = () => {
  const { user } = useAuth();
  const { isVerified } = usePremiumFeatures();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    address: "",
  });

  // Fetch verified businesses
  const { data: verifiedBusinesses } = useQuery({
    queryKey: ["verified-businesses", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("business_listings")
        .select("*")
        .eq("user_id", user?.id)
        .eq("verification_type", "verified");
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVerification = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://uvsxosexezyafgfimklv.supabase.co/functions/v1/verify-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        toast.success("Verification started successfully!");
        setOpen(false);
      } else {
        console.log()
        throw new Error(result.error || "Verification failed");
      }
    } catch (error) {
      toast.error(error.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        {!isVerified && <Button onClick={() => setOpen(true)}>Start Verification</Button>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Verification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input name="firstName" placeholder="First Name" onChange={handleInputChange} />
            <Input name="lastName" placeholder="Last Name" onChange={handleInputChange} />
            <Input name="dob" type="date" placeholder="Date of Birth" onChange={handleInputChange} />
            <Input name="address" placeholder="Address" onChange={handleInputChange} />
          </div>
          <DialogFooter>
            <Button onClick={handleVerification} disabled={loading}>{loading ? "Verifying..." : "Submit"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <TwoFactorAuth />
      <BillingSection />
    </div>
  );
};

export default ProfileForm;
