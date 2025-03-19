import { Button } from "@/components/ui/button";

interface FormSubmitButtonProps {
  isSubmitting?: boolean;
  disabled?: boolean;
  businessId?: string;
}

const FormSubmitButton = ({ isSubmitting, disabled, businessId }: FormSubmitButtonProps) => {

  console.log("Business ID:", businessId, "isSubmitting:", isSubmitting, "disabled:", disabled)

  return (
    <Button 
      type="submit" 
      className="w-full" 
      disabled={isSubmitting || disabled}
    >
      {isSubmitting ? "Creating..." : disabled ? "Verify Business to Submit" : "Create Listing"}
    </Button>
  );
};

export default FormSubmitButton;