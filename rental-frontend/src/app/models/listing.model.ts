/**
 * Represents a rental property listing returned by the Flask API.
 */
export interface IListing {
  /** MongoDB listing identifier serialized as a string. */
  _id: string;

  /** Main display title for the property. */
  title: string;

  /** Longer property description entered by the landlord. */
  description?: string;

  /** Monthly rental price in pounds sterling. */
  price_pcm: number;

  /** Number of bedrooms in the property. */
  bedrooms?: number;

  /** Number of bathrooms in the property. */
  bathrooms?: number;

  /** Property category such as flat, house, studio, or maisonette. */
  property_type?: string;

  /** Whether the property is furnished. */
  furnished?: boolean;

  /** Human-readable area or borough. */
  location: string;

  /** Date the property becomes available. */
  available_from?: string;

  /** Date the listing was posted. */
  posted_date?: string;

  /** Current listing status, for example active or archived. */
  status?: string;

  /** User id of the landlord or admin who created the listing. */
  posted_by?: string;
}

/**
 * Payload used when creating or updating a property listing.
 */
export interface IListingPayload {
  /** Main display title for the property. */
  title: string;

  /** Human-readable area or borough. */
  location: string;

  /** Monthly rental price in pounds sterling. */
  price_pcm: number;

  /** Optional longer property description. */
  description?: string;

  /** Optional number of bedrooms. */
  bedrooms?: number;

  /** Optional number of bathrooms. */
  bathrooms?: number;

  /** Optional property category. */
  property_type?: string;

  /** Optional furnished flag. */
  furnished?: boolean;

  /** Optional availability date. */
  available_from?: string;
}
