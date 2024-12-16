import GithubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@auth/prisma-adapter'
import db from '../../../../../prisma/db';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

export const options = {
	adapter: PrismaAdapter(db),
	session: {
		strategy: 'jwt',
		maxAge: 3000 // 50 minutos
	},
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET
		}),
		Credentials({
			credentials: {
				email: {
					label: 'E-mail',
					type: 'email',
					placeholder: 'Digite seu e-mail'
				},
				password: {
					label: 'Senha',
					type: 'password',
					placeholder: 'Digite sua senha'
				},
			},
			async authorize(credentials) {
				try {
					const foundUser = await db.user.findFirst({
						where: {
							email: credentials.email
						}
					});

					if (foundUser) {
						console.log('Usuário encontrado');

						// senha não encriptada e senha encriptada
						const passMatch = bcrypt.compareSync(credentials.password, foundUser.password);

						if (passMatch) {
							console.log('Senha correta');
							delete foundUser.password;
							return foundUser;
						}

					}

				} catch (error) {
					console.log('Erro ao autorizar o usuário', error);
				}

				// se chegar aqui, é pq deu erro
				return null;
			}
		})
	],
	callbacks: {
		async session({ session, token }) {
			if (session?.user) {
				session.user.id = parseInt(token.sub);
			}
			return session;
		}
	}
}
