import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SigninDto } from 'src/auth/dto/signin.dto';
import { SignupDto } from 'src/auth/dto/signup.dto';
import { comparePassword, hashPassword } from 'src/auth/utils/bcrypt.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/application/services/user.service';
import { UserMapper } from 'src/user/infrastructure/mappers/user.mapper';

@Injectable()
export class AuthService {

    constructor(private userService: UserService) {}

    async signup(data: SignupDto) {
        if(data.password !== data.confirmPassword) {
            throw new UnauthorizedException('Passwords do not match');
        }

        const userExists = await this.userService.findByEmail(data.email);

        if(userExists) {
            throw new UnauthorizedException('User already exists');
        }

        let hashedPassword = await hashPassword(data.password);

        const user = await this.userService.create({
            name: data.name,
            email: data.email,
            password: hashedPassword,
        });

        return UserMapper.toUserDto(user);
    }

    async signin(data: SigninDto) {
        const { email, password } = data;

        const user = await this.userService.findByEmail(email);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            throw new UnauthorizedException('Invalid password');
        }

        return UserMapper.toUserDto(user);
    }
}
