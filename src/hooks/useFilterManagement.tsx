import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useFilterManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    revenueRange: [0, 10000000] as [number, number],
    profitMargin: [0, 100] as [number, number],
    employeeCount: "",
    yearsInOperation: "",
    businessType: "",
    locationType: "",
    hasWebsite: false,
    hasSocialMedia: false,
    scalabilityRating: 0,
    isFranchiseAvailable: false,
    verificationType: "",
    location: "",
    industry: "",
  });

  const handleFilterChange = (newFilters: typeof filters) => {
    console.log("newFilters", newFilters);
    if (!user) {
      toast.error("Please sign in to use advanced filters");
      navigate("/login");
      return;
    }
    // setFilters(newFilters);
    setFilters((prev) => ({ ...prev, ...newFilters }));
    
    toast.success("Filters applied successfully");
  };

  const handleFilterReset = () => {
    setFilters({
      revenueRange: [0, 10000000] as [number, number],
      profitMargin: [0, 100] as [number, number],
      employeeCount: "",
      yearsInOperation: "",
      businessType: "",
      locationType: "",
      hasWebsite: false,
      hasSocialMedia: false,
      scalabilityRating: 0,
      isFranchiseAvailable: false,
      verificationType: "",
      location: "",
      industry: "",
    });
    toast.info("Filters have been reset");
  };

  console.log("hook main", filters);

  

  return {
    filters,
    handleFilterChange,
    handleFilterReset,
    setFilters,
  };
};
