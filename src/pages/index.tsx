import { parseCookies } from 'nookies';
import { GetServerSideProps } from 'next';

import { Head, Header, Footer } from 'src/components/shared';
import { Carousel, Categories, Services, VirtualCard } from 'src/components/Home';

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { 'session-id': sessionId } = parseCookies(context);
	const { 'session-auth': sessionAuth } = parseCookies(context);

	if (!sessionId) {
		return {
			props: {
				session: false,
			},
		};
	}

	return {
		props: {
			session: true,
			sessionAuth,
		},
	};
};

export default function Home({ session, sessionAuth }: { session: boolean; sessionAuth: string }) {
	return (
		<>
			<Head title={'Proyecto de residencias'} />

			<Header session={session} sessionAuth={sessionAuth} />

			<Carousel />

			<Categories session={session} />

			<Services session={session} />

			{session && <VirtualCard sessionAuth={sessionAuth} />}

			<Footer />
		</>
	);
}
