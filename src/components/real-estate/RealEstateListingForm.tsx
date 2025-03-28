import { useForm } from "react-hook-form";
import BasicPropertyInfo from "./form-sections/BasicPropertyInfo";
import LocationAndAmenities from "./form-sections/LocationAndAmenities";
import PropertyDetails from "./form-sections/PropertyDetails";
import VirtualTourSection from "./form-sections/VirtualTourSection";
import PropertyDocumentsSection from "./form-sections/PropertyDocumentsSection";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const RealEstateListingForm = () => {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      property_type: "",
      asking_price: "",
      location: "",
      description: "",
      square_footage: "",
      year_built: "",
      bedrooms: "",
      bathrooms: "",
      parking_spaces: "",
      amenities: [],
      has_virtual_tour: false,
      virtual_tour_url: "",
      verified_documents: [],
    },
  });

  const onSubmit = async (data: any) => {

    // console.log("Submitted data",data);
    // alert("Submitted data: "+JSON.stringify(data));

    try {
      const { verified_documents,documents, ...filteredData } = data;

      const { error } = await supabase
        .from("business_listings")
        .insert({
          ...filteredData,
          business_type: "real_estate",
          status: "draft",
        });
        if (error) {
          console.log(error);
          throw error;
        }

      if (error) throw error;

      toast.success("Property listing created successfully");
      alert("Property listing created successfully");
      navigate("/browse");
    } catch (error) {
      alert("Property listing created failed");
      console.error("Error creating property listing:", error);
      toast.error("Failed to create property listing");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <BasicPropertyInfo form={form} />
        <LocationAndAmenities form={form} />
        <PropertyDetails form={form} />
        <VirtualTourSection form={form} />
        <PropertyDocumentsSection form={form} />
        
        <Button type="submit" className="w-full">
          Create Listing
        </Button>
      </form>
    </Form>
  );
};

export default RealEstateListingForm;