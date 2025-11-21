import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/application/services/auth.service';
import { SigninDto } from 'src/auth/dto/signin.dto';
import { SignupDto } from 'src/auth/dto/signup.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService, private jwtService: JwtService) {}

    @Post('signup')
    async signup(@Body() signupDto: SignupDto, @Res() res: Response) {
        const user = await this.authService.signup(signupDto);
        
        const token = this.jwtService.sign({
            id: user.id,
            name: user.name,
            email: user.email
        })

        res.cookie('access-token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        res.json(user);
    }

    @Post('signin')
    async signin(@Body() signinDto: SigninDto, @Res() res: Response) {
        const user = await this.authService.signin(signinDto);
        
        const token = this.jwtService.sign({
            id: user.id,
            name: user.name,
            email: user.email
        })

        res.cookie('access-token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        res.json(user);
    }

    @Post('signout')
    async signout(@Res() res: Response) {
        res.clearCookie('access-token');
        res.json({ message: 'Logged out successfully' });
    }
}
