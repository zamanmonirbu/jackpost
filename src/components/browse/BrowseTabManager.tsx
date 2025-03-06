import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import AssetGrid from "../assets/AssetGrid";
import RealEstateListingsGrid from "../real-estate/RealEstateListingsGrid";
import BrowseTabs from "./BrowseTabs";

interface BrowseTabManagerProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  filters: any;
  isDynamicActive?: boolean;
  onFilterChange: (filters: any) => void;
  onFilterReset: () => void;
  setShowPaymentDialog: (show: boolean) => void;
}

const BrowseTabManager = ({
  activeTab,
  onTabChange,
  filters,
  isDynamicActive,
  onFilterChange,
  onFilterReset,
  setShowPaymentDialog,
}: BrowseTabManagerProps) => {
  const { data: assets, isLoading: assetsLoading } = useQuery({
    queryKey: ["assets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("asset_listings")
        .select("*")
        .eq("status", "published");
      if (error) throw error;
      return data;
    },
  });

  // console.log("assets", assets);

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="businesses" className="flex-1">
              Businesses
            </TabsTrigger>
            <TabsTrigger value="real-estate" className="flex-1">
              Real Estate
            </TabsTrigger>
            <TabsTrigger value="assets" className="flex-1">
              Assets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="businesses">
            <BrowseTabs
              filters={filters}
              isDynamicActive={isDynamicActive}
              onFilterChange={onFilterChange}
              onFilterReset={onFilterReset}
              setShowPaymentDialog={setShowPaymentDialog}
            />
          </TabsContent>

          <TabsContent value="real-estate">
            <RealEstateListingsGrid />
          </TabsContent>

          <TabsContent value="assets">
            <AssetGrid assets={assets} isLoading={assetsLoading} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BrowseTabManager;
