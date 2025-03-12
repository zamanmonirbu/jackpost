import { useEffect, useState } from "react";
import { PaymentMethodCheck } from "@/components/PaymentMethodCheck";
import { usePremiumFeatures } from "@/contexts/PremiumFeaturesContext";
import { useFeaturePayment } from "@/hooks/useFeaturePayment";
import HeroSection from "@/components/browse/HeroSection";
import VerificationBanner from "@/components/browse/VerificationBanner";
import BrowseTabManager from "@/components/browse/BrowseTabManager";
import { useFilterManagement } from "@/hooks/useFilterManagement";
import { useSearchParams } from "react-router-dom";

const Browse = () => {
  const { features } = usePremiumFeatures();
  const { purchaseFeature } = useFeaturePayment();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const isDynamicActive = features.find((f) => f.type === "dynamic_filters")?.isActive;
  const [activeTab, setActiveTab] = useState("businesses");

  const [searchParams] = useSearchParams();
  const location = searchParams.get("location") || "";
  const industry = searchParams.get("industry") || "";

  const { filters, handleFilterChange, handleFilterReset } = useFilterManagement();

  useEffect(() => {
    handleFilterChange({
      ...filters,
       location,
      industry,
    });
  }, [location, industry]);

  // console.log("filters from browse",filters)

  return (
    <PaymentMethodCheck>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <HeroSection activeTab={activeTab} />
        
        <VerificationBanner />
        
        <BrowseTabManager
          activeTab={activeTab}
          onTabChange={setActiveTab}
          filters={filters}
          isDynamicActive={isDynamicActive}
          onFilterChange={handleFilterChange}
          onFilterReset={handleFilterReset}
          setShowPaymentDialog={setShowPaymentDialog}
        />
      </div>
    </PaymentMethodCheck>
  );
};

export default Browse;
