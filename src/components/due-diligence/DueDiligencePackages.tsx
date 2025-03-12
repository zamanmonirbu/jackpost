import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface DueDiligencePackage {
  id: string;
  name: string;
  description: string;
  package_type: string;
  price: number;
  features: string[];
}

interface DueDiligencePackagesProps {
  packageType?: string;
}



const DueDiligencePackages = ({ packageType }: DueDiligencePackagesProps) => {
  const { user } = useAuth(); // Moved to the top
  const navigate = useNavigate(); // Moved to the top

  const { data: packages, isLoading, error } = useQuery({
    queryKey: ["dueDiligencePackages", packageType],
    queryFn: async () => {
      let query = supabase
        .from("due_diligence_packages")
        .select("*")
        .eq("is_active", true);

      if (packageType) {
        query = query.eq("package_type", packageType);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching packages:", error);
        throw error;
      }

      return data as DueDiligencePackage[];
    },
  });

  if (error) {
    toast.error("Failed to load due diligence packages");
    return <div>Error loading packages. Please try again later.</div>;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!packages || packages.length === 0) {
    return <div>No due diligence packages available at the moment.</div>;
  }

  const handlePurchase = async (pkg: DueDiligencePackage) => {
    if (!user) {
      toast.error("Please log in to purchase a due diligence package");
      navigate("/login");
      return;
    }

    try {
      const { data: { url }, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          featureType: 'due_diligence',
          packageId: pkg.id,
          amount: pkg.price*100
        }
      });

      if (error) throw error;
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to process payment');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {packages.map((pkg) => (
        <Card key={pkg.id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{pkg.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <p className="text-2xl font-bold mb-4">${pkg.price.toFixed(2)}</p>
            <p className="text-muted-foreground mb-4">{pkg.description}</p>
            <ul className="space-y-2 mb-6 flex-1">
              {pkg.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="mr-2">•</span>
                  {feature}
                </li>
              ))}
            </ul>
            <Button onClick={() => handlePurchase(pkg)} className="w-full">
              Purchase Package
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DueDiligencePackages;
