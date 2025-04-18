//Модели данных: Товар, Пользователь, Корзина.

// Интерфейс для товара (Item)

export interface IItem {
    id: string;
    title: string;              
    image: string;
    price: number;
    category: string;          
    description: string;
}

// Интерфейс для пользователя (User)

export interface IUser {
    id: string;       
    email: string;
    phone: string;
}

// Интерфейс для корзины (Basket)

export interface IBasket {
    items: IItem[];            
    total: number;             
    paymentMethod: string;
    shippingAddress: string;  
    buyerId: string; 
    statusOrder: string;      
}

// Интерфейс отображений Views

export interface IMainPageView {
    renderItems(items: IItem[]): void;    // Отображение списка товаров
    showError(message: string): void;
}
export interface ItemCardView {
    render(item: IItem): void;   // Отображение конкретной карточки товара
    onAddToBasketClick(item: IItem): void;
}
export interface ItemModalView {
    render(item: IItem): void;   // Отображение информации о товаре в модальном окне
    onAddToBasketClick(item: IItem): void;
    closeModal(): void;   
}
export interface BasketModalView {
    renderBasket(basket: IBasket): void;   // Отображение содержимого корзины
    onRemoveItemClick(item: IItem): void;
    closeModal(): void;
}
export interface PaymentModalView {
    renderPaymentForm(basket: IBasket): void;   // Отображение формы оплаты заказа
    onPaymentSubmit(paymentDetails: { paymentMethod: string, shippingAddress: string }): void;  
    showError(message: string): void;
}
export interface ContactsModalView {
    renderContactForm(user: IUser): void;   // Отображение формы ввода контактных данных
    onSubmitContactForm(user: IUser): void;
}
export interface SuccessOrderModalView {
    renderSuccessMessage(): void;  // Модальное окно, которое отображается после успешного завершения заказа
}

export interface IOrderData {
    email?: string,
    phone?: string,
    payment?: string,
    address?: string
}