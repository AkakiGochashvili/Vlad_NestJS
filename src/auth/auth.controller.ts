import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { HttpCode } from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common/enums';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('singup')
	singup(@Body() body: AuthDto) {
		return this.authService.singup(body);
	}

	@HttpCode(HttpStatus.OK)
	@Post('singin')
	singin(@Body() body: AuthDto) {
		return this.authService.singin(body);
	}
}
