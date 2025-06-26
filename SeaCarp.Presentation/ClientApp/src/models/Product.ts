export interface Product {
    id: number;
    ProductName: string;
    Description: string;
    Stock: number;
    Price: number;
    Category: string;
    Reviews: [];
    RelatedProducts: [];
}