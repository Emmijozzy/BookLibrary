import { Book } from "./book"

export interface Category {
    id?: string
    books?: Book[]
    createdAt?: string
    updatedAt?: string
    name: string
    description: string
}