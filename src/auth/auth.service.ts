import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { hash, verify } from 'argon2';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { BadRequestException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
		private config: ConfigService
	) {}

	async singup(body: AuthDto): Promise<User> {
		const hashed_password = await hash(body.password);

		const user_data = {
			...body,
			hash: hashed_password
		};

		delete user_data.password;

		try {
			const user = await this.prisma.user.create({
				data: user_data
			});

			delete user.hash;

			return user;
		} catch (error) {
			if (error?.code === 'P2002') {
				throw new BadRequestException(
					'User with this email is already registered'
				);
			}
		}
	}

	async singin(body: AuthDto) {
		const user = await this.prisma.user.findUnique({
			where: {
				email: body.email
			}
		});

		if (!user) {
			throw new BadRequestException(
				'User with this email is not registered'
			);
		}

		const password_matches = await verify(user.hash, body.password);

		if (!password_matches) {
			throw new BadRequestException('Wrong Password');
		}

		return this.signToken(user.id, user.email);
	}

	private async signToken(
		userId: number,
		email: string
	): Promise<{ access_token: string }> {
		const payload = {
			sub: userId,
			email
		};

		const secret = this.config.get('JWT_SECRET');

		const token = await this.jwt.signAsync(payload, {
			expiresIn: '15m',
			secret
		});

		return { access_token: token };
	}
}
