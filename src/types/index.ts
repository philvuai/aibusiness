// Upload types
export interface UploadedFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

// Property types
export interface Property {
  id?: string;
  address: string;
  postcode: string;
  propertyType: string;
  bedrooms?: number;
  bathrooms?: number;
  size?: string;
  price?: number;
  description?: string;
  photos?: UploadedFile[];
  features?: string[];
  agent?: Agent;
  createdAt?: Date;
  updatedAt?: Date;
}

// Form data types
export interface PropertyFormData {
  address: string;
  postcode: string;
  propertyType: 'Commercial' | 'Residential' | 'Industrial';
  bedrooms?: number;
  bathrooms?: number;
  size?: string;
  price?: number;
  description?: string;
  photos: File[];
  agent: string;
}

// Agent types
export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  title?: string;
  department?: string;
  bio?: string;
  photo?: string;
}

// EPC data types
export interface EpcData {
  lmkKey: string;
  address: string;
  postcode: string;
  currentEnergyRating: string;
  potentialEnergyRating: string;
  currentEnergyEfficiency: string;
  potentialEnergyEfficiency: string;
  propertyType: string;
  totalFloorArea: string;
  environmentalImpactCurrent: string;
  co2EmissionsCurrent: string;
  lodgementDate: string;
  transactionType: string;
}

// Google Maps types
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface GoogleMapsData {
  coordinates: Coordinates;
  staticMapUrl: string;
  nearbyTransport: TransportLink[];
  placeDetails?: unknown;
}

export interface TransportLink {
  name: string;
  type: 'rail' | 'bus' | 'airport' | 'tube';
  distance: string;
  walkingTime?: string;
  coordinates: Coordinates;
}

// AI Enhancement types
export interface AIEnhancedData {
  enhanced_description: string;
  market_analysis: string;
  key_features: string[];
  target_buyer: string;
  investment_potential: string;
}

// Complete brochure data
export interface BrochureData {
  property: Property;
  agent: Agent;
  photos: string[];
  epcData?: EpcData;
  googleMapsData?: GoogleMapsData;
  aiEnhanced?: AIEnhancedData;
  generatedAt: Date;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  error: string;
  details?: unknown;
  status?: number;
}

// Form validation types
export interface FormErrors {
  [key: string]: string | undefined;
}

// Google Maps autocomplete types
export interface PlaceAutocomplete {
  description: string;
  matched_substrings: unknown[];
  place_id: string;
  reference: string;
  structured_formatting: {
    main_text: string;
    main_text_matched_substrings: unknown[];
    secondary_text: string;
  };
  terms: unknown[];
  types: string[];
}

// Database types (for future use with Neon)
export interface DatabaseProperty extends Property {
  id: string;
  agentId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseAgent extends Agent {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Export utility types
export type PropertyStatus = 'draft' | 'active' | 'sold' | 'withdrawn';
export type PropertyCategory = 'residential' | 'commercial' | 'industrial' | 'retail' | 'office' | 'land';
export type TransportType = 'rail' | 'bus' | 'airport' | 'tube' | 'metro';

// Global window extensions for Google Maps
declare global {
  interface Window {
    google: typeof google;
    googleMapsApiLoaded: boolean;
  }
}
