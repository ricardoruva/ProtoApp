import { useState, useEffect } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';

import styles from './styles/carousel.module.css';

export const StyledCarousel = styled.div<{ position: string }>`
	transform: translateX(${(props) => props.position});
`;

export default function Carousel() {
	const [arrayImages, setArrayImages] = useState<string[]>([]);
	const [position, setPosition] = useState<number>(0);
	const [newPosition, setNewPosition] = useState<number>(0);

	useEffect(() => {
		const images = ['cinepolis.jpg', 'cinemex.jpg', 'cfe-internet.jpg', 'omnibus-mexico.png'];

		setArrayImages(images);
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			let currentPositionRight = (position + 1) % arrayImages.length;

			setPosition(currentPositionRight);
			setNewPosition(currentPositionRight * -(100 / arrayImages.length));
		}, 5000);

		return () => clearInterval(interval);
	}, [position, arrayImages.length]);

	const images = arrayImages.map((image, index) => {
		return {
			id: index,
			image: `/img/carousel/${image}`,
		};
	});

	const allImagesForCarousel = images.map((currentImage) => {
		return (
			<Link key={currentImage.id} className={styles.link} href={{ pathname: '../../' }}>
				<Image
					className={styles.styledImage}
					src={currentImage.image}
					alt={`image ${currentImage.id + 1}`}
					width={1000}
					height={1000}
					quality={100}
					priority={true}
				/>
			</Link>
		);
	});

	return (
		<>
			<section className={styles.carouselContainer}>
				<div>
					<div>
						<StyledCarousel position={`${newPosition}%`} className={styles.styledCarousel}>
							{allImagesForCarousel}
						</StyledCarousel>
					</div>
				</div>
			</section>
		</>
	);
}
