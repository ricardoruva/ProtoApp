import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useContracts } from 'src/hooks/GetDBData';
import { MdWorkspacesFilled } from 'react-icons/md';
import { getServerSideProps } from 'src/utils/SessionAuthenticator';

import * as StringUtilities from 'src/utils/StringUtilities';

import classNames from 'classnames';

import { Head, Header, Footer, Button } from 'src/components/shared';
import { Contract, AddContract } from 'src/components/Service';

import styles from 'src/styles/service.module.css';

interface ServiceProps {
	session: boolean;
	sessionAuth: string;
}

export default function Service(props: ServiceProps) {
	const { session, sessionAuth } = props;
	const router = useRouter();
	const selectedService = router.query.service ? router.query.service.toString() : '';
	const [addContractStatus, setAddConctractStatus] = useState<boolean>(false);

	const contracts = useContracts({ service: selectedService });

	const name =
		selectedService === 'cfe'
			? selectedService.toUpperCase()
			: StringUtilities.wordsToCapitalLetter({ text: selectedService });

	const handleAddContractStatusChange = () => {
		setAddConctractStatus((status) => !status);
	};

	const renderContracts = contracts.map((contract) => {
		return (
			<Contract
				key={contract.id}
				id={contract.id}
				name={contract.name}
				description={contract.description}
				image={contract.image}
				service={contract.service}
				cashback={contract.cashback}
				sessionAuth={sessionAuth}
			/>
		);
	});

	return (
		<>
			<Head title={selectedService} />

			<Header session={session} sessionAuth={sessionAuth} />

			<section className={styles.service}>
				<article className={styles.iconTitle}>
					<MdWorkspacesFilled className={styles.icon} />
					<h2>{name}</h2>
				</article>
				{renderContracts.length > 0 && <Button icon={'add'} onClick={handleAddContractStatusChange} />}
			</section>

			<section className={classNames(styles.renderContracts, renderContracts.length > 0 ? null : styles.noContracts)}>
				{renderContracts.length > 0 ? (
					renderContracts
				) : (
					<>
						<h2>{'No hay contratos disponibles'}</h2>
						<Button label={'Agregar contrato'} onClick={handleAddContractStatusChange} />
					</>
				)}
			</section>

			{addContractStatus && <AddContract handleCloseCartel={handleAddContractStatusChange} />}

			<Footer />
		</>
	);
}

export { getServerSideProps };
