import { z } from "zod";

export const businessListingSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  listingTitle: z.string().min(1, "Listing title is required"),
  industry: z.string().min(1, "Please select an industry"),
  location: z.string().min(2, "Location is required"),
  askingPrice: z.string().min(1, "Asking price is required"),
  annualRevenue: z.string().min(1, "Annual revenue is required"),
  description: z.string().min(10, "Description must be at least 10 characters long. Please provide details about your business."),
  employeeCount: z.string().min(1, "Employee count is required"),
  profitMargin: z.string().min(1, "Profit margin is required"),
  hasLiens: z.enum(["yes", "no"]).default("no"),
  hasRecurringRevenue: z.enum(["yes", "no"]).default("no"),
  includesRealEstate: z.enum(["yes", "no"]).default("no"),
  includesIP: z.enum(["yes", "no"]).default("no"),
  includesEquipment: z.enum(["yes", "no"]).default("no"),
  isFranchise: z.enum(["yes", "no"]).default("no"),
  soleOwner: z.enum(["yes", "no"]).default("yes"),
  hasSOPs: z.enum(["yes", "no"]).default("no"),
  hasLoyaltyProgram: z.enum(["yes", "no"]).default("no"),
  collectsCustomerData: z.enum(["yes", "no"]).default("no"),
  isCurrentlyProfitable: z.enum(["yes", "no"]).default("yes"),
  yearsInOperation: z.string().min(1, "Years in operation is required"),
  numberOfLocations: z.string().min(1, "Number of locations is required"),
  website: z.string().optional(),
  monthlyCashFlow: z.string().min(1, "Monthly cash flow is required"),
  totalDebt: z.string().optional(),
  image_url: z.string().optional(),
  image_urls: z.array(z.string()).default([]),
  taxId: z.string().min(1, "Tax ID is required for business verification"),
  street: z.string().min(1, "Street address is required for verification"),
  city: z.string().min(1, "City is required for verification"),
  state: z.string().min(1, "State is required for verification"),
  postalCode: z.string().min(5, "Valid postal code is required for verification"),
  propertyStyle: z.string().optional(),
  constructionStatus: z.string().optional(),
  buildingClass: z.string().optional(),
  energyRating: z.string().optional(),
  amenities: z.array(z.string()).default([]),
  neighborhoodFeatures: z.array(z.string()).default([]),
  investmentMetrics: z.record(z.string(), z.any()).optional(),
});

export type BusinessListingFormData = z.infer<typeof businessListingSchema>;