import { useState, useEffect } from 'react';

type User = {
	id: number;
	name: string;
	email: string;
	password: string;
	birthdate: string;
	picture: string;
	cashback: string;
	admin: number;
	sessionAuth: string;
};

type Cart = {
	id: number;
	product: string;
	priceSelected: number;
	cashback: number;
	quantity: number;
	dateAdded: number;
};

type Purchase = {
	id: number;
	username: string;
	products: string[];
	prices: number[];
	quantitys: number[];
	date: string;
	dateAdded: number;
};

type Product = {
	id: number;
	name: string;
	dateAdded: number;
	image: string;
	description: string;
	cashback: string;
	price: string[];
	category: string;
	type: string;
};

type Card = {
	id: number;
	type: string;
	holder: string;
	number: string;
	expirationDate: string;
	securityCode: number;
};

type Contract = {
	id: number;
	name: string;
	description: string;
	image: string;
	service: string;
	cashback: number;
	dateAdded: number;
};

type UserDB = {
	id: number;
	email: string;
	username: string;
	password: string;
	birthdate: string;
	profile_picture: string;
	total_cashback: string;
	admin: number;
	session_auth: string;
};

type CartDB = {
	id: number;
	product: string;
	price_selected: number;
	cashback: number;
	quantity: number;
	date_added: number;
};

type PurchaseDB = {
	id: number;
	username: string;
	products: string;
	products_prices: string;
	products_quantity: string;
	date: string;
	date_added: number;
};

type ProductDB = {
	id: number;
	product: string;
	date_added: number;
	image: string;
	description: string;
	cashback: string;
	price: string;
	category: string;
	type: string;
};

type CardDB = {
	id: number;
	type: string;
	holder: string;
	number: string;
	expiration_date: string;
	security_code: number;
};

type ContractDB = {
	id: number;
	name: string;
	description: string;
	image: string;
	service: string;
	cashback: number;
	date_added: number;
};

export const GetCurrentUserData = ({ sessionAuth }: { sessionAuth: string }) => {
	const [userData, setUserData] = useState<User>();

	useEffect(() => {
		fetch('/api/get/user-data', {
			method: 'POST',
			body: JSON.stringify({ sessionAuth }),
			headers: { 'Content-Type': 'application/json' },
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.user) {
					const db: UserDB = data.user as UserDB;

					setUserData({
						id: db.id,
						name: db.username,
						email: db.email,
						password: db.password,
						birthdate: db.birthdate,
						picture: db.profile_picture,
						cashback: db.total_cashback,
						admin: db.admin,
						sessionAuth: db.session_auth,
					});
				}
			});
	}, [sessionAuth]);

	return userData;
};

export const GetAllUsersData = () => {
	const [usersData, setUsersData] = useState<User[]>([]);

	useEffect(() => {
		fetch('/api/get/users-data', {
			method: 'GET',
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.users) {
					const getDBUsers = data.users.map((user: UserDB) => {
						return {
							id: user.id,
							name: user.username,
							email: user.email,
							password: user.password,
							birthdate: user.birthdate,
							picture: user.profile_picture,
							cashback: user.total_cashback,
							admin: user.admin,
							sessionAuth: user.session_auth,
						};
					});

					setUsersData(getDBUsers);
				}
			});
	}, []);

	return usersData;
};

export const GetCurrentUserCart = ({ sessionAuth }: { sessionAuth: string }) => {
	const [userCart, setUserCart] = useState<Cart[]>([]);

	useEffect(() => {
		const currentTime: number = Date.now();

		fetch('/api/get/user-cart', {
			method: 'POST',
			body: JSON.stringify({ sessionAuth }),
			headers: { 'Content-Type': 'application/json' },
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.error) {
					console.log(data.error);
				} else {
					const getDBCart = data.cart.map((product: CartDB) => {
						return {
							id: product.id,
							product: product.product,
							priceSelected: product.price_selected,
							cashback: product.cashback,
							quantity: product.quantity,
							dateAdded: product.date_added,
						};
					});

					getDBCart.sort((a: any, b: any) => b.dateAdded - currentTime - (a.dateAdded - currentTime));

					setUserCart(getDBCart);
				}
			});
	}, [sessionAuth]);

	return userCart;
};

export const GetCurrentUserPurchases = ({ sessionAuth }: { sessionAuth: string }) => {
	const [currentUserPurchases, setCurrentUserPurchases] = useState<Purchase[]>([]);

	useEffect(() => {
		fetch('/api/get/user-purchases', {
			method: 'POST',
			body: JSON.stringify({ sessionAuth }),
			headers: { 'Content-Type': 'application/json' },
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.purchases) {
					const purchasesDB: Purchase[] = data.purchases.map((purchase: PurchaseDB) => {
						return {
							id: purchase.id,
							username: purchase.username,
							products: purchase.products.split(', '),
							prices: purchase.products_prices.split(', '),
							quantitys: purchase.products_quantity.split(', '),
							date: purchase.date,
							dateAdded: purchase.date_added,
						};
					});

					setCurrentUserPurchases(purchasesDB);
				}
			});
	}, [sessionAuth]);

	return currentUserPurchases;
};

export const GetAllPurchases = () => {
	const [purchases, setPurchases] = useState<Purchase[]>([]);

	useEffect(() => {
		fetch('/api/get/all-purchases', {
			method: 'GET',
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.purchases) {
					const purchasesDB: Purchase[] = data.purchases.map((purchase: PurchaseDB) => {
						return {
							id: purchase.id,
							username: purchase.username,
							products: purchase.products.split(', '),
							prices: purchase.products_prices.split(', '),
							quantitys: purchase.products_quantity.split(', '),
							date: purchase.date,
							dateAdded: purchase.date_added,
						};
					});

					setPurchases(purchasesDB);
				}
			});
	}, []);

	return purchases;
};

export const GetProducts = ({ category }: { category: string }) => {
	const [products, setProducts] = useState<Product[]>([]);

	useEffect(() => {
		fetch('/api/get/products', {
			method: 'POST',
			body: JSON.stringify({ category }),
			headers: { 'Content-Type': 'application/json' },
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.products) {
					const productsDB: Product[] = data.products.map((product: ProductDB) => {
						return {
							id: product.id,
							name: product.product,
							dateAdded: product.date_added,
							image: product.image,
							description: product.description,
							cashback: product.cashback,
							price: product.price.split(', '),
							category: product.category,
							type: product.type,
						};
					});

					setProducts(productsDB);
				}
			});
	}, [category]);

	return products;
};

export const GetCurrentUserCards = ({ sessionAuth }: { sessionAuth: string }) => {
	const [userCards, setUserCards] = useState<Card[]>([]);

	useEffect(() => {
		fetch('/api/get/user-cards', {
			method: 'POST',
			body: JSON.stringify({ sessionAuth }),
			headers: { 'Content-Type': 'application/json' },
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.error) {
					return [];
				} else {
					const cardsDB: Card[] = data.cards.map((card: CardDB) => {
						return {
							id: card.id,
							type: card.type,
							holder: card.holder,
							number: card.number,
							expirationDate: card.expiration_date,
							securityCode: card.security_code,
						};
					});

					setUserCards(cardsDB);
				}
			});
	}, [sessionAuth]);

	return userCards;
};

export const useContracts = ({ service }: { service: string }) => {
	const [contracts, setContracts] = useState<Contract[]>([]);

	useEffect(() => {
		fetch('/api/get/contracts', {
			method: 'POST',
			body: JSON.stringify({ service }),
			headers: { 'Content-Type': 'application/json' },
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.contracts) {
					const contractsDB: Contract[] = data.contracts.map((contract: ContractDB) => {
						return {
							id: contract.id,
							name: contract.name,
							description: contract.description,
							image: contract.image,
							service: contract.service,
							cashback: contract.cashback,
							dateAdded: contract.date_added,
						};
					});

					setContracts(contractsDB);
				}
			});
	}, [service]);

	return contracts;
};
