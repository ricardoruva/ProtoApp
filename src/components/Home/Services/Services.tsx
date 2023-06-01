import { useRouter } from 'next/router';
import { MdWorkspacesFilled } from 'react-icons/md';

import * as StringUtilities from 'src/utils/StringUtilities';

import Image from 'next/image';

import styles from './styles/services.module.css';

interface SessionProps {
	session: boolean;
}

export default function Services(props: SessionProps) {
	const { session } = props;
	const router = useRouter();

	const servicesName = ['cfe', 'telmex', 'otros'];

	const services = servicesName.map((service, index) => {
		return {
			id: index,
			name: service,
			image: `/img/services/${service}.png`,
		};
	});

	const renderServices = services.map((currentService) => {
		const service = currentService.name;
		const name =
			currentService.name === 'cfe'
				? currentService.name.toUpperCase()
				: StringUtilities.wordsToCapitalLetter({ text: currentService.name });

		const routerPush = () => {
			if (session) {
				router.push({ pathname: './service', query: { service } });
			}
		};

		return (
			<button onClick={routerPush} key={currentService.id} className={styles.service}>
				<Image
					className={styles.image}
					src={
						currentService.image === '/img/services/otros.png' ? '/img/placeholder-200x200.png' : currentService.image
					}
					alt={currentService.name}
					width={200}
					height={200}
					priority={true}
				/>
				<h3 className={styles.title}>{name}</h3>
			</button>
		);
	});

	return (
		<>
			<section className={styles.servicesSection}>
				<div className={styles.servicesContainer}>
					<div className={styles.titleSection}>
						<MdWorkspacesFilled className={styles.icon} />
						<h2>{'Servicios'}</h2>
						<div className={styles.line} />
					</div>
					<h3>{'Disfruta de los servicios que te ofrecemos'}</h3>
					<article className={styles.renderServices}>{renderServices}</article>
				</div>
			</section>
		</>
	);
}
