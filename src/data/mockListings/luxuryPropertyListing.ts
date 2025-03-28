import type { BusinessListing } from "@/types/supabase";

export const luxuryPropertyListing: BusinessListing = {
  id: "2",
  user_id: "user2",
  business_name: "Luxury Beach House",
  listing_title: "Premium Beachfront Property Investment Opportunity",
  industry: "Real Estate",
  location: "Miami Beach, FL",
  asking_price: 2500000,
  yearly_revenue: 120000,
  description: "Beautiful beachfront property with stunning ocean views",
  image_url: "/placeholder.svg",
  status: "published",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  employee_count: null,
  operating_hours: null,
  established_date: "2010",
  profit_margin: "60%",
  assets: "Fully furnished property",
  competitor_analysis: "Prime location with high demand",
  is_temporary: false,
  years_in_operation: "13",
  business_type: "Real Estate",
  location_type: "owned",
  customer_type: "luxury",
  recurring_revenue_percentage: 100,
  has_website: true,
  has_social_media: true,
  scalability_rating: 7,
  debt_to_equity_ratio: 0,
  monthly_revenue: 10000,
  is_franchise_available: false,
  verification_type: "api",
  verification_date: new Date().toISOString(),
  api_verified_data: null,
  property_type: "residential",
  square_footage: 4500,
  number_of_units: 1,
  year_built: 2010,
  lot_size: "0.5 acres",
  zoning_type: "residential",
  parking_spaces: 2,
  has_virtual_tour: true,
  virtual_tour_url: "https://example.com/tour",
  property_category: "luxury",
  bedrooms: 4,
  bathrooms: 3.5,
  property_features: {
    pool: true,
    beach_access: true,
    security_system: true,
    smart_home: true
  },
  document_verification_status: "verified",
  verified_documents: {
    deed: true,
    tax_records: true,
    insurance: true
  },
  is_featured: true,
  featured_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  property_tax_info: {
    annual_amount: 25000,
    last_assessment_date: "2023-01-01"
  },
  zoning_info: "R-1 Single Family Residential",
  property_style: "Modern Beach House",
  construction_status: "Completed",
  building_class: "A",
  energy_rating: "A+",
  amenities: ["Pool", "Beach Access", "Smart Home Features"],
  neighborhood_features: ["Beachfront", "Gated Community", "Parks"],
  investment_metrics: {
    roi: "12%",
    cap_rate: "5.8%",
    occupancy_rate: "95%"
  },
  profiles: {
    full_name: "Sarah Smith",
    email: "sarah@example.com",
    id: "user2",
    avatar_url: null,
    phone: null,
    role: null,
    city: null,
    state: null,
    country: null,
    is_verified: true,
    is_admin: false,
    created_at: new Date().toISOString(),
    verification_date: new Date().toISOString()
  }
};