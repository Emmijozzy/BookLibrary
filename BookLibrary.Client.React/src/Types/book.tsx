export interface Book {
    id?: string;
    title: string;
    author: string;
    description: string;
    genre: string;
    isbn: string;
    language: string;
    numberOfPage: number;
    publisher: string;
    publicationDate: string;
    imageUrl?: string;
    categoryId?: string;
    pdf?:  File | null;
    image?: File | null;
    pdfUrl?: string;
}