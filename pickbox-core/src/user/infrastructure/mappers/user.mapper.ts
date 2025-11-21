import { User } from "src/user/entities/user.entity";

export class UserMapper {
    static toUser(user: User) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            ownedFiles: user.ownedFiles,
            sharedFiles: user.sharedFiles,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    static toUserDto(user: User) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}
    