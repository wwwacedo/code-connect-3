import GithubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@auth/prisma-adapter'
import db from '../../../../../prisma/db';
import Credentials from 'next-auth/providers/credentials';

export const options = {
	adapter: PrismaAdapter(db),
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
				}
			}
		})
	],
	callbacks: {
		async session({ session, user }) {
			if (session?.user) {
				session.user.id = user.id;
			}
			return session;
		}
	}
}
