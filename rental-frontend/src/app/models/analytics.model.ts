/**
 * Average rent aggregation result returned by the analytics endpoint.
 */
export interface IAverageRent {
  /** Location used as the MongoDB aggregation group key. */
  _id: string;

  /** Average monthly rent for the grouped location. */
  average_price_pcm: number;

  /** Number of listings included in the grouped location. */
  total_listings_in_area: number;
}

/**
 * Popular property type aggregation result returned by the analytics endpoint.
 */
export interface IPopularType {
  /** Property type used as the MongoDB aggregation group key. */
  _id: string;

  /** Number of listings matching this property type. */
  total_count: number;
}
