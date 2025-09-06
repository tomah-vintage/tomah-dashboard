interface Product {
	id: number;
	name: string;
	price: number;
	createdAt: string;
	updatedAt: string;
}

let products: Product[] = [];
let nextProductId = 1;

// Seed initial data
for (let i = 1; i <= 25; i++) {
	products.push({
		id: nextProductId++,
		name: `Product ${i}`,
		price: parseFloat((Math.random() * 100 + 10).toFixed(2)),
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	});
}

export const productsDb = {
	findMany: (page: number, limit: number): { products: Product[]; total: number; page: number; totalPages: number } => {
		const start = (page - 1) * limit;
		const end = start + limit;
		const paginatedProducts = products.slice(start, end);
		const total = products.length;
		const totalPages = Math.ceil(total / limit);
		return { products: paginatedProducts, total, page, totalPages };
	},

	findById: (id: number): Product | undefined => {
		return products.find((p) => p.id === id);
	},

	create: (data: { name: string; price: number }): Product => {
		const newProduct: Product = {
			id: nextProductId++,
			name: data.name,
			price: data.price,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};
		products.push(newProduct);
		return newProduct;
	},

	update: (id: number, data: { name?: string; price?: number }): Product | undefined => {
		const productIndex = products.findIndex((p) => p.id === id);
		if (productIndex === -1) {
			return undefined;
		}
		products[productIndex] = { ...products[productIndex], ...data, updatedAt: new Date().toISOString() };
		return products[productIndex];
	},

	delete: (id: number): boolean => {
		const initialLength = products.length;
		products = products.filter((p) => p.id !== id);
		return products.length < initialLength;
	}
};
