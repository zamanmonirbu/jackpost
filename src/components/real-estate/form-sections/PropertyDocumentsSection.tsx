import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import DocumentUploader from "../documents/DocumentUploader";
import DocumentList from "../documents/DocumentList";
import { supabase } from "@/integrations/supabase/client";

interface PropertyDocumentsSectionProps {
  form: UseFormReturn<any>;
}

const PropertyDocumentsSection = ({ form }: PropertyDocumentsSectionProps) => {
  const [isUploading, setIsUploading] = useState(false);
  
  // const handleFileUpload = async (e) => {
  //   const formData = new FormData();
  //   formData.append("file", e.target.files[0]);


  //   console.log("formData", formData)
  //   setIsUploading(true);
  
  //   try {
  //     const response = await fetch("https://uvsxosexezyafgfimklv.supabase.co/functions/v1/verify-document", {
  //       method: "POST",
  //       body: formData,
  //     });
  
  //     if (!response.ok) {
  //       throw new Error("Failed to upload document");
  //     }
  
  //     const result = await response.json();
  //     if (result.success) {
  //       console.log("Document uploaded and verified successfully:", result.documentUrl);
  //       // Display the document URL in your UI, or store it for later use
  //     } else {
  //       console.log("Verification failed:", result.error);
  //     }
  //   } catch (error) {
  //     alert("Failed to upload document");
  //     console.error("Upload error:", error);
  //   }
  // };
  


  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    try {
      
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) throw new Error("User not authenticated");
  
      const userId = userData.user.id;
      const fileExt = file.name.split('.').pop(); 
      const uniqueFileName = `${crypto.randomUUID()}.${fileExt}`; 
  
      const bucketName = "verify-documents"; 
      const filePath = `${userId}/${uniqueFileName}`; 
  
      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, { upsert: true }); 
      if (uploadError) throw uploadError;
  
      const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);
      const publicUrl = urlData.publicUrl;
  
      console.log("File uploaded successfully:", publicUrl);
      toast.success("File uploaded successfully!");

      console.log("UserId and public URL",userId,publicUrl);
  
      const { error: dbError } = await supabase
        .from("document_listings") 
        .insert({
          user_id: userId,
          file_url: publicUrl,
          status: "pending",
        });
  
      if (dbError) throw dbError;
  
      toast.success("Document record saved in database!");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
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