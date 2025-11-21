import { User } from "src/user/entities/user.entity"
import { FileShare } from "./file-share.entity"

export class FileEntity {
    id: string
    filename: string
    originalName: string
    mimeType: string
    size: number
    path: string
    isPublic: boolean
    ownerId: string
    owner: User
    shares: FileShare[]
    createdAt: Date
    updatedAt: Date
}
