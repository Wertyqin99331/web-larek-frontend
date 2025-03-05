// Слой модели

// Модель продукта
export interface IProduct {
	id: string
	description: string
	image: string
	title: string
	category: string
	price: number
}

// Модель информации о пользователе заказа
export interface IUserInfo {
	payment: PaymentType
	email: string
	phone: string
	address: string
}

// Модель информации о содержимом заказа
export interface IOrderInfo {
	total: number
	items: string[]
}

// Модель заказа
type Order = IUserInfo | IOrderInfo;

// Модель типа платежа
export type PaymentType = 'Онлайн' | 'При получении'

// Сервис по работе с заказами
export interface IOrderService {
	processPayment(order: Order): void
}

// Сервис по работе с корзиной
export interface IBasket {
	getItems(): string[]
	add(id: string): void
	remove(id: string): void
	clear(): void
	getTotalSum(): number
}



// Слой Presentation (типы находятся в файле events.ts)


// Слой View

// Базовый интерфейс для любой view
export interface IView<T> {
	render(data?: T): HTMLElement
}

// Базовый интерфейс модального окна
export interface IModal<T> extends IView<T> {
	open(): void
	close(): void
}

// View для отображения списка продуктов
export interface IProductListView extends IView<IProduct[]> {
	openProduct(id: string): void
}

// Модальное окно для отображения одного продукта
export interface IProductModalView extends IModal<IProduct> {
	addProductToBasket(id: string): void
}

// Модальное окно для оформления заказа для отображения формы заказа, пока undefined, наверное неверно
export interface IOrderForm extends IModal<undefined> {
	processOrder(): void;
}


// Модальное окно для отображения корзины
export interface IBasketView extends IModal<string[]> {
	startToProcessOrder(): void
	deleteItem(id: string): void
}


