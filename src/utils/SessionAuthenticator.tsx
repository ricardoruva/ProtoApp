import { parseCookies } from 'nookies';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { 'session-id': sessionId } = parseCookies(context);
	const { 'session-auth': sessionAuth } = parseCookies(context);

	if (!sessionId) {
		return {
			redirect: {
				destination: './',
				permanent: false,
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

export default getServerSideProps;
