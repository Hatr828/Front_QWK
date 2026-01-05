# Front_QWK — фронтенд веб‑приложения на Svelte

**Front_QWK** — клиентская часть веб‑приложения, разработанная с использованием Svelte. Проект ради экзаменов. Фронтенд предоставляет интерфейс для прохождения тестов и отправки ответов, взаимодействуя с бэкендом через REST API.

## Технологии

- **SvelteKit (Svelte 5)** — фреймворк для создания веб‑приложений на Svelte
- **TypeScript** — статическая типизация для фронтенда
- **Bootstrap 5** — UI‑компоненты/сеточная система
- **Chart.js** — графики/диаграммы
- **Vite** — сборка

## Быстрый старт

### Установка

```bash
git clone https://github.com/Hatr828/Front_QWK.git
cd Front_QWK
npm install
```

### Настройка адреса API

Создайте файл `.env` в корне проекта:

```bash
PUBLIC_API_BASE="http://localhost:8000"
```

Значение должно указывать на базовый URL API бэкенда.

### Запуск

```bash
npm run dev
```

### Сборка (production)

```bash
npm run build
npm run preview
```

## Структура проекта

```
Front_QWK/
├─ src/                      
│   ├─ routes/               # Маршруты и страницы приложения
│   │   ├─ +page.svelte      # Главная страница
│   │   ├─ home/+page.svelte # домашняя страница
│   │   ├─ test/[id]/+page.svelte    # Динамический маршрут (тест по ID)
│   │   └─ admin/…           # Админ‑раздел (управление тестами)
│   ├─ lib/                  # Компоненты и утилиты
│   │   ├─ api/              # Работа с API (HTTP‑запросы, авторизация)
│   │   └─ components/       # Переиспользуемые компоненты
│   ├─ app.html              
│   └─ app.css             
├─ static/                  
├─ svelte.config.js         
├─ vite.config.ts          
├─ package.json             
├─ tsconfig.json             
└─ README.md                 
```

## Полезные ссылки

- Документация Svelte / SvelteKit: https://svelte.dev/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Bootstrap 5: https://getbootstrap.com/docs/5.3/getting-started/introduction/

## Скриншоты

### 1) Главная страница / стартовый экран

<img width="1920" height="1080" alt="Снимок экрана 2026-01-05 121904" src="https://github.com/user-attachments/assets/2baa515b-17ea-4865-b70e-0f69f901378e" />

---

### 3.1) Прохождение теста

<img width="1920" height="1080" alt="Снимок экрана 2026-01-05 122005" src="https://github.com/user-attachments/assets/4b74c40c-da68-4eb8-a7f4-ae4d81c0c762" />

---

### 3.2) Прохождение теста

<img width="1920" height="1080" alt="Снимок экрана 2026-01-05 122012" src="https://github.com/user-attachments/assets/55b0f259-fcc1-4b76-9515-ea411859b120" />

---

### 3.2) Регистрация

<img width="1920" height="1080" alt="Снимок экрана 2026-01-05 115554" src="https://github.com/user-attachments/assets/0f7912be-dd93-44fb-b4d3-2b76bc376b82" />

