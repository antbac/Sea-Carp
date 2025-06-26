export interface Product {
    id: number;
    Name: string;
    Description?: string;
    Stock: number;
    Price: number;
    Category: string;
    Reviews: [];
    RelatedProducts: [];
}