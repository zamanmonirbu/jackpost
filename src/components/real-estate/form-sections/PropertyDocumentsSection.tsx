import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import DocumentUploader from "../documents/DocumentUploader";
import DocumentList from "../documents/DocumentList";

interface PropertyDocumentsSectionProps {
  form: UseFormReturn<any>;
}

const PropertyDocumentsSection = ({ form }: PropertyDocumentsSectionProps) => {
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileUpload = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);


    console.log("formData", formData)
    setIsUploading(true);
  
    try {
      const response = await fetch("https://uvsxosexezyafgfimklv.supabase.co/functions/v1/verify-document", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to upload document");
      }
  
      const result = await response.json();
      if (result.success) {
        console.log("Document uploaded and verified successfully:", result.documentUrl);
        // Display the document URL in your UI, or store it for later use
      } else {
        console.log("Verification failed:", result.error);
      }
    } catch (error) {
      alert("Failed to upload document");
      console.error("Upload error:", error);
    }
  };
  

  const removeDocument = (index: number) => {
    const currentDocs = form.getValues('verified_documents') || [];
    const newDocs = [...currentDocs];
    newDocs.splice(index, 1);
    form.setValue('verified_documents', newDocs);
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="verified_documents"
        render={() => (
          <FormItem>
            <FormLabel>Property Documents</FormLabel>
            <div className="space-y-4">
              <DocumentList 
                documents={form.watch('verified_documents')} 
                onRemove={removeDocument}
              />
              <DocumentUploader 
                onUpload={handleFileUpload}
                isUploading={isUploading}
              />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PropertyDocumentsSection;