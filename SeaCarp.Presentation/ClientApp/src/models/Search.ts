import type { Product } from "./Product";

export interface Search {
    searchQuery: string;
    matchingProducts: Product[];
}