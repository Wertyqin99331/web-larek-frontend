# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

---
## Архитектура проекта
Проект использует следующие архитектурные принципы:

- **Разделение на слои**:

    - **Слой данных (M)**: содержит модели данных и их бизнес логику
    - **Слой отображения (V)**: содержит компоненты пользовательского интерфейса, отвечающие за отображение данных
    - **Слой связывания (P)**: связывает слой данных и слой отображения через событийную модель.

- **Слабое связывание (Loose Coupling)**:
    - Взаимодействие между компонентами осуществляется через события, а не через жесткую зависимость внутри классов. Это позволяет изменять и тестировать отдельные части системы независимо друг от друга.

## Типизация и модели данных
Все типы данных собраны в файле `src/types/index.ts`, что обеспечивает централизованное управление интерфейсами и типами. Типы разделены по функциональным группам:

## Модели данных
Эта часть содержит типы, которые располагаются на слое данных. Это либо сами модели, либо некоторые сервисы, которые 
отвечают за выполнение бизнес логики. В моем случае это модели продуктов, корзины, заказа и соответствующие сервисы

Основой модель моего приложения является продукт.
```ts
export interface IProduct {
  id: string
  description: string
  image: string
  title: string
  category: string
  price: number
}
```

Далее в приложении есть форма заказа, которая имеет следующий вид
```ts
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
```
Она состоит из информации и самом пользователе и его заказе

Далее в слое модели есть сервис по работе с заказами, который отвечает за непосредственно обработку заказа
```ts
export interface IOrderService {
	processPayment(order: Order): void
}
```

Также в приложении имеется корзина, для которой также нужен сервис
```ts
export interface IOrderService {
	processPayment(order: Order): void
}
```

## Модели связывания
На этом слое находятся модели, которые отвечают за отправку некоторых событий от слоя к слоя. Все это находится в events.ts

```ts
// Хорошая практика даже простые типы выносить в алиасы
// Зато когда захотите поменять это достаточно сделать в одном месте
type EventName = string | RegExp;
type Subscriber = Function;
type EmitterEvent = {
    eventName: string,
    data: unknown
};

export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

/**
 * Брокер событий, классическая реализация
 * В расширенных вариантах есть возможность подписаться на все события
 * или слушать события по шаблону например
 */
export class EventEmitter implements IEvents {
    _events: Map<EventName, Set<Subscriber>>;

    constructor() {
        this._events = new Map<EventName, Set<Subscriber>>();
    }

    /**
     * Установить обработчик на событие
     */
    on<T extends object>(eventName: EventName, callback: (event: T) => void) {
        if (!this._events.has(eventName)) {
            this._events.set(eventName, new Set<Subscriber>());
        }
        this._events.get(eventName)?.add(callback);
    }

    /**
     * Снять обработчик с события
     */
    off(eventName: EventName, callback: Subscriber) {
        if (this._events.has(eventName)) {
            this._events.get(eventName)!.delete(callback);
            if (this._events.get(eventName)?.size === 0) {
                this._events.delete(eventName);
            }
        }
    }

    /**
     * Инициировать событие с данными
     */
    emit<T extends object>(eventName: string, data?: T) {
        this._events.forEach((subscribers, name) => {
            if (name === '*') subscribers.forEach(callback => callback({
                eventName,
                data
            }));
            if (name instanceof RegExp && name.test(eventName) || name === eventName) {
                subscribers.forEach(callback => callback(data));
            }
        });
    }

    /**
     * Слушать все события
     */
    onAll(callback: (event: EmitterEvent) => void) {
        this.on("*", callback);
    }

    /**
     * Сбросить все обработчики
     */
    offAll() {
        this._events = new Map<string, Set<Subscriber>>();
    }

    /**
     * Сделать коллбек триггер, генерирующий событие при вызове
     */
    trigger<T extends object>(eventName: string, context?: Partial<T>) {
        return (event: object = {}) => {
            this.emit(eventName, {
                ...(event || {}),
                ...(context || {})
            });
        };
    }
}


```

Вот код, предоставленный авторами курса. Мы видим некий общий интерфейс IEvents, который определяет некий общий брокер сообщений.
И далее видим пример реализации брокера. Этот брокер далее будет использоваться модели представления и моделями бизнес-логики 
для общения друг с другом. Это позволяет достичь низкой связности кода. 


## Модели отображения
На этом слое находятся компоненты, которые отвечают за отображение данных на странице.

Самым главным элементом здесь является некий интерфейс UI элемента, который позволяет отрендерить 
некие данные

```ts
export interface IView<T> {
	render(data?: T): HTMLElement
}
```

Далее т.к в приложении есть модальные окна, я создал отдельную модель для них
```ts
export interface IModal<T> extends IView<T> {
  open(): void
  close(): void
}
```
Модальное окно умеет как-то закрываться и открываться

Далее я определил первую модель представления для списка продуктов

```ts
export interface IProductListView extends IView<IProduct[]> {
  openProduct(id: string): void
}
```
Оно должно уметь открывать модалку для некоторого продукта, поэтому был добавлен соотв метод

Далее в приложении есть функция просмотра отдельного продукта в модалке, поэтому также была создана отдельная модель
```ts
// Модальное окно для отображения одного продукта
export interface IProductModalView extends IModal<IProduct> {
  addProductToBasket(id: string): void
}
```
В модальном окне есть кнопка добавления продукта в корзину, поэтому должна быть соответствующая логика

Сообственно сама корзина
```ts
// Модальное окно для отображения корзины
export interface IBasketView extends IModal<string[]> {
  startToProcessOrder(): void
  deleteItem(id: string): void
}

```
Мы умеем удалять элементы из корзины, а также мы можем начать оформление заказа

И последняя фукнция приложения - обработка заказа

```ts
// Модальное окно для оформления заказа для отображения формы заказа, пока undefined, наверное неверно
export interface IOrderForm extends IModal<undefined> {
  processOrder(): void;
}
```
Единственная возможность здесь - это оформить заказ







