# 💇‍♀️ DOM VOLOS — AI Виджет Виртуальной Примерки Париков

Интерактивный виджет примерки париков с использованием искусственного интеллекта (**GPT Image 2** / **Google Gemini API**) и прямой синхронизацией каталога с **OpenCart**.

![DOM VOLOS Banner](public/logo/dom-volos.png)

---

## 🚀 Особенности и Возможности

- **🤖 Продвинутый ИИ-перенос причёсок**:
  - Использование **GPT Image 2** (OpenAI) или **Gemini API** (`gemini-3.1-flash-image-preview`).
  - Сохранение идентичности человека: 100% точность лица, глаз, мимики, тона кожи, одежды и фона.
  - Точный перенос цвета, длины, формы и кудрей выбранного парика.

- **🛒 Прямая интеграция с OpenCart**:
  - Динамическая загрузка активных категорий и товаров через REST API.
  - Автоматическая фильтрация пустых категорий (с 0 товаров).
  - Отображение актуальных цен, скидок и прямых ссылок на карточки товаров в магазине.

- **✨ Премиальный UX/UI Дизайн**:
  - Пошаговый мастер примерки (*Шаг 1: Фото → Шаг 2: Парик → Шаг 3: Примерка*).
  - Адаптивная пагинация каталога (по 8 товаров на страницу).
  - Мобильный выпадающий список выбора категорий.
  - Микроанимации, стеклянные градиенты (glassmorphism) и скелетоны загрузки.

- **🏷️ Автоматический брендинг (Watermarking)**:
  - Автоматическое наложение фирменного логотипа `DOM VOLOS` по центру нижней части итоговой фотографии через **Sharp**.

---

## 🛠️ Технологический Стек

- **Фреймворк**: [Next.js 14](https://nextjs.org/) (App Router, React 18)
- **Язык**: TypeScript
- **Стилизация**: Tailwind CSS (Vanilla CSS переменные + ключевые кадры анимаций)
- **Обработка Изображений**: Sharp (Node.js)
- **AI Провайдеры**: OpenAI API (`gpt-image-2` / `v1/images/edits`), Google GenAI SDK
- **Интеграция**: OpenCart REST API Proxy

---

## 📦 Быстрый Запуск и Установка

### 1. Клонирование репозитория
```bash
git clone https://github.com/your-org/wig-demo.git
cd wig-demo
```

### 2. Установка зависимостей
```bash
npm install
```

### 3. Настройка переменных окружения
Создайте файл `.env.local` в корневом каталоге проекта:

```env
# Ключ OpenAI для модели GPT Image 2 (Рекомендуется)
OPENAI_API_KEY=sk-proj-...
GPT_IMAGE_MODEL=gpt-image-2

# Резервный ключ Google Gemini (Опционально)
GEMINI_API_KEY=AIzaSy...

# Конфигурация OpenCart API
OPENCART_API_KEY=a0gNm42gAbMXfLMpFNZynOot1Dv9YhpmfxYXRPZtjKPGARPo
OPENCART_API_BASE_URL=https://odomvolos.devpro.agency/index.php
```

### 4. Запуск локального сервера разработки
```bash
npm run dev
```

Откройте в браузере: **[http://localhost:3000](http://localhost:3000)** (или `http://localhost:3001`).

---

## 📂 Структура Проекта

```text
wig-demo/
├── app/
│   ├── api/
│   │   ├── catalog/
│   │   │   └── route.ts          # Proxy для OpenCart API (категории и товары)
│   │   └── generate/
│   │       └── route.ts          # AI обработчик примерки (Sharp + OpenAI/Gemini)
│   ├── globals.css               # Дизайн-система, анимации и стили
│   ├── layout.tsx                # Корневой макет
│   └── page.tsx                  # Главная страница виджета
├── components/
│   ├── category-selector.tsx     # Селектор категорий (3-рядная сетка / Mobile Dropdown)
│   ├── catalog-pagination.tsx    # Пагинация товаров каталога
│   ├── result-panel.tsx          # Панель генерации и показа результата
│   ├── selfie-guide-card.tsx     # Карточка рекомендаций по съемке селфи
│   ├── selfie-upload-controls.tsx# Загрузка и превью селфи
│   ├── wig-option-card.tsx       # Карточка товара с ценами и ссылкой в магазин
│   └── wig-try-on-widget.tsx     # Главный виджет виртуальной примерки
├── lib/
│   ├── app-config.ts             # Конфигурация API роутов
│   └── wigs.ts                   # Типы данных и fallback-каталог
├── public/
│   ├── logo/
│   │   └── dom-volos.png         # Фирменный логотип для водяных знаков
│   └── wigs/                     # Резервные локальные фото париков
├── universal-prompt.txt          # Системный JSON-промпт защиты лица и переноса волос
└── README.md                     # Документация проекта
```

---

## 🔬 Как Работает AI-Обработка Примерки (`/api/generate`)

1. **Загрузка данных**: Пользователь загружает фото своего лица и выбирает парик из каталога.
2. **Получение референса**: Сервер скачивает изображение парика с сервера OpenCart (или берет из fallback).
3. **Композиция кадра**: Через `sharp` создается комбинированное изображение: *Селфи (слева) + Парик (справа)*.
4. **Запрос в OpenAI (`gpt-image-2`)**: В эндпоинт `v1/images/edits` отправляется составной кадр вместе со строгими инструкциями из `universal-prompt.txt`.
5. **Наложение брендинга**: На полученный результат по центру внизу накладывается белая версия логотипа `DOM VOLOS`.
6. **Вывод**: Виджет отображает готовое фото высокого разрешения с кнопками скачивания и перехода к покупке.

---

## 🛍️ Интеграция с OpenCart

Модуль OpenCart подключает данный виджет через iFrame или прямой React-компонент по адресу:
`https://odomvolos.devpro.agency/admin/index.php?route=extension/module/domvolos_tryon`

- **Endpoint Категорий**: `GET /api/catalog` (проксирует OpenCart `route=api/tryon/categories`).
- **Endpoint Товаров**: `GET /api/catalog?categoryId={id}` (проксирует OpenCart `route=api/tryon/products`).

---

## 📝 Лицензия

Разработано специально для **DOM VOLOS** © 2026. Все права защищены.
