import { industries, states } from "@/components/business-listing/constants";
import { Button } from "@/components/ui/button";
import { useFilterManagement } from "@/hooks/useFilterManagement";
import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import IndustryInput from "./IndustryInput";
import LocationInput from "./LocationInput";

const SmartSearchBar = () => {
  const navigate = useNavigate();
  const { handleFilterChange } = useFilterManagement();
  const [locationInput, setLocationInput] = useState("");
  const [industryInput, setIndustryInput] = useState("");
  const [suggestions, setSuggestions] = useState({
    states: [],
    industries: [],
  });

  const [searchValue, setSearchValue] = useState({
    revenueRange: [0, 100000000] as [number, number],
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
    industry: "",
    state: "",
    priceRange: [0, 100000000],
    grossRevenue: [0, 100000000],
  });

  // const handleSearch = () => {
  //   if (!locationInput && !industryInput) {
  //     toast.error("Please enter a location or industry to search");
  //     return;
  //   }

  //   const updatedSearchValue = {
  //     ...searchValue,
  //     state: locationInput,
  //     industry: industryInput,
  //     location: locationInput,
  //     revenueRange: searchValue.revenueRange as [number, number],
  //     grossRevenue: searchValue.grossRevenue as [number, number],
  //     profitMargin: searchValue.profitMargin as [number, number],
  //   };

  //   console.log("updatedSearchValue", updatedSearchValue);

  //   setSearchValue(updatedSearchValue);
  //   handleFilterChange(updatedSearchValue);
  //   setFilters(updatedSearchValue);
  //   navigate(`/browse`);
  // };

  const handleSearch = () => {
    if (!locationInput && !industryInput) {
      toast.error("Please enter a location or industry to search");
      return;
    }

    const updatedSearchValue = {
      ...searchValue,
      location: locationInput, // Ensure correct field name
      industry: industryInput,
    };

    console.log("updatedSearchValue", updatedSearchValue);

    // Ensure only relevant filters are passed
    const filteredSearchValue = {
      revenueRange: updatedSearchValue.revenueRange as [number, number],
      profitMargin: updatedSearchValue.profitMargin as [number, number],
      employeeCount: updatedSearchValue.employeeCount,
      yearsInOperation: updatedSearchValue.yearsInOperation,
      businessType: updatedSearchValue.businessType,
      locationType: updatedSearchValue.locationType,
      hasWebsite: updatedSearchValue.hasWebsite,
      hasSocialMedia: updatedSearchValue.hasSocialMedia,
      scalabilityRating: updatedSearchValue.scalabilityRating,
      isFranchiseAvailable: updatedSearchValue.isFranchiseAvailable,
      verificationType: updatedSearchValue.verificationType,
      location: updatedSearchValue.location, // Ensure matching field names
      industry: updatedSearchValue.industry,
    };

    setSearchValue(updatedSearchValue);
    handleFilterChange(filteredSearchValue); // ✅ No need to call `setFilters` separately
    navigate(`/browse`);
  };

  const handleLocationInputChange = (value: string) => {
    setLocationInput(value);
    setSuggestions((prev) => ({
      ...prev,
      states: states.filter((loc) =>
        loc.toLowerCase().includes(value.toLowerCase())
      ),
    }));
  };

  const handleIndustryInputChange = (value: string) => {
    setIndustryInput(value);
    setSuggestions((prev) => ({
      ...prev,
      industries: industries.filter((ind) =>
        ind.toLowerCase().includes(value.toLowerCase())
      ),
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-auto flex-1">
          <LocationInput
            value={locationInput}
            onChange={handleLocationInputChange}
            suggestions={suggestions.states}
            onSelectSuggestion={(location) => {
              setLocationInput(location);
              setSuggestions((prev) => ({ ...prev, states: [] }));
            }}
          />
        </div>

        <div className="w-full md:w-auto flex-1">
          <IndustryInput
            value={industryInput}
            onChange={handleIndustryInputChange}
            suggestions={suggestions.industries}
            onSelectSuggestion={(industry) => {
              setIndustryInput(industry);
              setSuggestions((prev) => ({ ...prev, industries: [] }));
            }}
          />
        </div>

        <Button
          onClick={handleSearch}
          className="w-full md:w-auto bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 text-white"
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
    </div>
  );
};

export default SmartSearchBar;
