import { FileShare } from "src/file/entities/file-share.entity"
import { FileEntity } from "src/file/entities/file.entity"

export class User {
    id: string
    name: string
    email: string
    password: string
    ownedFiles?: FileEntity[]
    sharedFiles?: FileShare[]
    createdAt: Date
    updatedAt: Date
}
