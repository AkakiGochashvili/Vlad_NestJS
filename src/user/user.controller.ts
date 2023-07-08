import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('user')
export class UserController {
	@UseGuards(JwtGuard)
	@Get('me')
	getMe(@Request() req) {
		console.log(req.user);

		return 'user info';
	}
}
