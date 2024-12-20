export interface Category {
    id: string;
    name: string;
    description?: string;
}

export type CategoryWithoutId = Omit<Category, 'id'>

export interface Place {
    id: string;
    name: string;
    description?: string;
}

export interface Item {
    id: string;
    categoryId: string;
    placeId: string;
    name: string;
    description?: string;
    image: string | null;
}