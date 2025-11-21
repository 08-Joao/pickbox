import { FileRole } from "generated/prisma"


export class FileShare {
    id: string
    fileId: string
    userId: string
    role: FileRole
    createdAt: Date
    updatedAt: Date
}
