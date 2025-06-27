export interface Product {
    id: number;
    productName: string;
    description: string;
    stock: number;
    price: number;
    category: string;
    reviews: [];
    relatedProducts: [];
}