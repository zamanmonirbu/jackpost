import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AssetBasicInfo from "@/components/assets/form-sections/AssetBasicInfo";
import AssetImageUpload from "@/components/assets/form-sections/AssetImageUpload";
import EscrowSection from "@/components/assets/form-sections/EscrowSection";
import { assetSchema } from "@/components/assets/schema";
import type { AssetFormData } from "@/components/assets/types";

const EditAsset = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { assetId } = useParams(); 
  const [loading, setLoading] = useState(true);

  const form = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: "Equipment",
      condition: "New",
      location: "",
    },
  });

  // Fetch asset data
  useEffect(() => {
    const fetchAsset = async () => {
        console.log("assetId",assetId)
      if (!assetId) return;
      setLoading(true);

      const { data, error } = await supabase
        .from("asset_listings")
        .select("*")
        .eq("id", assetId)
        .single();

        console.log("assets dataaaaa",data)

      if (error || !data) {
        toast.error("Failed to fetch asset details");
        navigate("/assets"); // Redirect if asset not found
        return;
      }

      // Ensure only the asset owner can edit
      if (data.user_id !== user?.id) {
        toast.error("You do not have permission to edit this asset");
        navigate("/assets");
        return;
      }

      form.reset(data); // Pre-fill form with existing data
      setLoading(false);
    };

    fetchAsset();
  }, [assetId, user, navigate, form]);

  const onSubmit = async (data: AssetFormData) => {
    try {
      if (!assetId) throw new Error("Invalid asset ID");

      const { error } = await supabase
        .from("asset_listings")
        .update({ ...data })
        .eq("id", assetId);

      if (error) throw error;

      toast.success("Asset updated successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating asset:", error);
      toast.error("Failed to update asset");
    }
  };

  if (loading) return <p>Loading asset details...</p>;

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Asset</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <AssetBasicInfo form={form} />
          <AssetImageUpload form={form} />
          <EscrowSection form={form} />

          <Button type="submit" className="w-full">
            Update Listing
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditAsset;
