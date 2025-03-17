import { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FilePlus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface PropertyDocumentsSectionProps {
  form: UseFormReturn<any>;
}

const PropertyDocumentsSection = ({ form }: PropertyDocumentsSectionProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      // Generate a unique file path for the PDF
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

      // Upload the PDF to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('property_documents') // Replace with your bucket name
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL of the uploaded PDF
      const { data: { publicUrl } } = supabase.storage
        .from('property_documents')
        .getPublicUrl(filePath);

      // Update the form value with the PDF URL
      const currentDocuments = form.getValues('documents') || [];
      form.setValue('documents', [...currentDocuments, publicUrl]);

      toast.success('Document uploaded successfully');
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  const removeDocument = (index: number) => {
    const currentDocuments = form.getValues('documents') || [];
    const newDocuments = [...currentDocuments];
    newDocuments.splice(index, 1);
    form.setValue('documents', newDocuments);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          disabled={isUploading}
          onClick={() => document.getElementById('property-document')?.click()}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <FilePlus className="h-4 w-4 mr-2" />
          )}
          Upload Document
        </Button>
        <input
          id="property-document"
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleDocumentUpload}
        />
      </div>

      {/* Display uploaded documents */}
      {form.watch('documents')?.map((documentUrl, index) => (
        <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
          <a
            href={documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Document {index + 1}
          </a>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeDocument(index)}
          >
            Remove
          </Button>
        </div>
      ))}
    </div>
  );
};

export default PropertyDocumentsSection;