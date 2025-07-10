# MongoDB Atlas Express API

Цей проект демонструє повну інтеграцію Express.js сервера з MongoDB Atlas, включаючи всі основні операції CRUD (Create, Read, Update, Delete) та розширені можливості роботи з базою даних.

## Огляд проекту

Проект побудований на основі Node.js та Express.js фреймворку з використанням MongoDB Atlas як хмарної бази даних. API надає доступ до колекцій фільмів, театрів, коментарів та вбудованих фільмів з можливістю виконання всіх основних операцій з даними.

## Технології

- **Node.js** - серверне середовище виконання JavaScript
- **Express.js** - веб-фреймворк для Node.js
- **MongoDB Atlas** - хмарна база даних MongoDB
- **MongoDB Driver** - офіційний драйвер для роботи з MongoDB
- **dotenv** - для управління змінними середовища

## Встановлення та налаштування

### Передумови

- Node.js версії 14 або вище
- Обліковий запис MongoDB Atlas
- Git (опціонально)

### Кроки встановлення

1. Клонуйте репозиторій або завантажте файли проекту
2. Встановіть залежності:
   ```bash
   npm install
   ```

3. Створіть файл `.env` в кореневій директорії проекту:
   ```env
   MONGO_CONNECTION=your_mongodb_atlas_connection_string
   PORT=3000
   ```

4. Замініть `your_mongodb_atlas_connection_string` на ваш справжній рядок підключення до MongoDB Atlas

5. Запустіть сервер:
   ```bash
   node app.js
   ```

## Структура API

### Базовий URL
```
http://localhost:3000
```

### Головний ендпоінт

#### GET /
Повертає список всіх доступних ендпоінтів API з їх описом.

**Приклад відповіді:**
```json
{
  "message": "MongoDB Atlas Express API",
  "endpoints": {
    "GET /theaters": "Отримати театри",
    "GET /comments": "Отримати коментарі",
    "GET /embedded_movies": "Отримати вбудовані фільми",
    "GET /movies": "Отримати фільми",
    "GET /movies/projection?fields=title,year": "Отримати фільми з проекцією полів",
    "POST /movies": "Створити новий фільм",
    "POST /movies/many": "Створити багато фільмів",
    "PUT /movies/:id": "Оновити фільм за ID",
    "PUT /movies": "Оновити багато фільмів",
    "PUT /movies/:id/replace": "Замінити фільм за ID",
    "DELETE /movies/:id": "Видалити фільм за ID",
    "DELETE /movies": "Видалити багато фільмів"
  }
}
```

## Операції читання (Read)

### GET /theaters
Отримує список театрів з бази даних (обмежено 10 записами).

**Приклад запиту:**
```bash
curl -X GET http://localhost:3000/theaters
```

### GET /comments
Отримує список коментарів з бази даних (обмежено 10 записами).

**Приклад запиту:**
```bash
curl -X GET http://localhost:3000/comments
```

### GET /embedded_movies
Отримує список вбудованих фільмів з бази даних (обмежено 10 записами).

**Приклад запиту:**
```bash
curl -X GET http://localhost:3000/embedded_movies
```

### GET /movies
Отримує список фільмів з бази даних (обмежено 10 записами).

**Приклад запиту:**
```bash
curl -X GET http://localhost:3000/movies
```

**Приклад відповіді:**
```json
[
  {
    "_id": "573a1390f29313caabcd42e8",
    "title": "The Great Train Robbery",
    "year": 1903,
    "genres": ["Short", "Western"],
    "plot": "A group of bandits stage a brazen train hold-up...",
    "runtime": 12
  }
]
```

### GET /movies/projection
Отримує список фільмів з можливістю вибору конкретних полів (проекція).

**Параметри запиту:**
- `fields` - список полів через кому для відображення

**Приклад запиту:**
```bash
curl -X GET "http://localhost:3000/movies/projection?fields=title,year,genres"
```

**Приклад відповіді:**
```json
[
  {
    "_id": "573a1390f29313caabcd42e8",
    "title": "The Great Train Robbery",
    "year": 1903,
    "genres": ["Short", "Western"]
  }
]
```

## Операції створення (Create)

### POST /movies
Створює новий фільм в базі даних (insertOne).

**Тіло запиту:**
```json
{
  "title": "Новий фільм",
  "year": 2024,
  "genres": ["Drama", "Action"],
  "plot": "Опис сюжету фільму",
  "runtime": 120
}
```

**Приклад запиту:**
```bash
curl -X POST http://localhost:3000/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Тестовий фільм",
    "year": 2024,
    "genres": ["Drama"],
    "plot": "Це тестовий фільм",
    "runtime": 90
  }'
```

**Приклад відповіді:**
```json
{
  "message": "Movie created successfully",
  "insertedId": "686fdd2bd7c17a85dc6a2ace"
}
```

### POST /movies/many
Створює кілька фільмів одночасно в базі даних (insertMany).

**Тіло запиту:**
```json
[
  {
    "title": "Фільм 1",
    "year": 2024,
    "genres": ["Action"],
    "plot": "Перший фільм",
    "runtime": 100
  },
  {
    "title": "Фільм 2",
    "year": 2024,
    "genres": ["Comedy"],
    "plot": "Другий фільм",
    "runtime": 95
  }
]
```

**Приклад запиту:**
```bash
curl -X POST http://localhost:3000/movies/many \
  -H "Content-Type: application/json" \
  -d '[
    {
      "title": "Фільм 1",
      "year": 2024,
      "genres": ["Action"],
      "plot": "Перший фільм",
      "runtime": 100
    },
    {
      "title": "Фільм 2", 
      "year": 2024,
      "genres": ["Comedy"],
      "plot": "Другий фільм",
      "runtime": 95
    }
  ]'
```

**Приклад відповіді:**
```json
{
  "message": "Movies created successfully",
  "insertedCount": 2,
  "insertedIds": {
    "0": "686fdd2bd7c17a85dc6a2acf",
    "1": "686fdd2bd7c17a85dc6a2ad0"
  }
}
```

## Операції оновлення (Update)

### PUT /movies/:id
Оновлює конкретний фільм за його ID (updateOne).

**Параметри URL:**
- `id` - MongoDB ObjectId фільму

**Тіло запиту:**
```json
{
  "plot": "Оновлений опис сюжету",
  "runtime": 130
}
```

**Приклад запиту:**
```bash
curl -X PUT http://localhost:3000/movies/686fdd2bd7c17a85dc6a2ace \
  -H "Content-Type: application/json" \
  -d '{
    "plot": "Оновлений опис сюжету",
    "runtime": 130
  }'
```

**Приклад відповіді:**
```json
{
  "message": "Movie updated successfully",
  "modifiedCount": 1
}
```

### PUT /movies
Оновлює кілька фільмів одночасно за заданими критеріями (updateMany).

**Тіло запиту:**
```json
{
  "filter": {
    "year": 2024
  },
  "update": {
    "updated": true,
    "updatedAt": "2024-01-10T12:00:00.000Z"
  }
}
```

**Приклад запиту:**
```bash
curl -X PUT http://localhost:3000/movies \
  -H "Content-Type: application/json" \
  -d '{
    "filter": {"year": 2024},
    "update": {"updated": true, "updatedAt": "2024-01-10T12:00:00.000Z"}
  }'
```

**Приклад відповіді:**
```json
{
  "message": "Movies updated successfully",
  "matchedCount": 3,
  "modifiedCount": 3
}
```

### PUT /movies/:id/replace
Повністю замінює документ фільму новими даними (replaceOne).

**Параметри URL:**
- `id` - MongoDB ObjectId фільму

**Тіло запиту:**
```json
{
  "title": "Повністю новий фільм",
  "year": 2025,
  "genres": ["Sci-Fi"],
  "plot": "Цей фільм був повністю замінений",
  "runtime": 150,
  "replaced": true
}
```

**Приклад запиту:**
```bash
curl -X PUT http://localhost:3000/movies/686fdd2bd7c17a85dc6a2ace/replace \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Повністю новий фільм",
    "year": 2025,
    "genres": ["Sci-Fi"],
    "plot": "Цей фільм був повністю замінений",
    "runtime": 150,
    "replaced": true
  }'
```

**Приклад відповіді:**
```json
{
  "message": "Movie replaced successfully",
  "modifiedCount": 1
}
```

## Операції видалення (Delete)

### DELETE /movies/:id
Видаляє конкретний фільм за його ID (deleteOne).

**Параметри URL:**
- `id` - MongoDB ObjectId фільму

**Приклад запиту:**
```bash
curl -X DELETE http://localhost:3000/movies/686fdd2bd7c17a85dc6a2ace
```

**Приклад відповіді:**
```json
{
  "message": "Movie deleted successfully",
  "deletedCount": 1
}
```

### DELETE /movies
Видаляє кілька фільмів одночасно за заданими критеріями (deleteMany).

**Тіло запиту:**
```json
{
  "filter": {
    "year": 2024
  }
}
```

**Приклад запиту:**
```bash
curl -X DELETE http://localhost:3000/movies \
  -H "Content-Type: application/json" \
  -d '{
    "filter": {"year": 2024}
  }'
```

**Приклад відповіді:**
```json
{
  "message": "Movies deleted successfully",
  "deletedCount": 2
}
```

## Обробка помилок

API включає комплексну обробку помилок для всіх ендпоінтів:

### Типи помилок

1. **400 Bad Request** - неправильний формат запиту
2. **404 Not Found** - ресурс не знайдено
3. **500 Internal Server Error** - внутрішня помилка сервера

### Приклади відповідей з помилками

**404 Not Found:**
```json
{
  "error": "Movie not found"
}
```

**400 Bad Request:**
```json
{
  "error": "Request body must be an array"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

## Тестування API

Проект включає автоматизований тестовий файл `test_api.js`, який перевіряє всі ендпоінти API.

### Запуск тестів

1. Переконайтеся, що сервер запущений:
   ```bash
   node app.js
   ```

2. В іншому терміналі запустіть тести:
   ```bash
   node test_api.js
   ```

### Що тестується

- Читання фільмів з базовою та розширеною проекцією
- Створення одного та кількох фільмів
- Оновлення одного та кількох фільмів
- Заміна фільму
- Видалення одного та кількох фільмів

## Структура проекту

```
js-lesson-63-mongo-atlas/
├── app.js              # Головний файл сервера
├── package.json        # Залежності та скрипти
├── package-lock.json   # Зафіксовані версії залежностей
├── .env               # Змінні середовища (не включено в git)
├── .env.example       # Приклад файлу змінних середовища
├── test_api.js        # Автоматизовані тести API
├── README.md          # Документація проекту
└── node_modules/      # Встановлені залежності
```

## Безпека та найкращі практики

### Змінні середовища
Всі чутливі дані, такі як рядки підключення до бази даних, зберігаються в файлі `.env` та не включаються в систему контролю версій.

### Валідація даних
API включає базову валідацію вхідних даних для запобігання помилкам та забезпечення цілісності даних.

### Обробка ObjectId
Всі операції з MongoDB ObjectId правильно обробляються з використанням офіційного драйвера MongoDB.

### Логування
Всі операції з базою даних логуються в консоль для відстеження та налагодження.

## Розширення функціональності

Проект можна легко розширити додаванням:

1. **Аутентифікації та авторизації** - використовуючи JWT токени
2. **Валідації схеми** - використовуючи Joi або подібні бібліотеки
3. **Пагінації** - для обробки великих наборів даних
4. **Кешування** - використовуючи Redis
5. **Документації API** - використовуючи Swagger/OpenAPI
6. **Тестування** - використовуючи Jest або Mocha

## Підтримка та внесок

Для повідомлення про помилки або пропозицій щодо покращення, будь ласка, створіть issue в репозиторії проекту.

## Ліцензія

Цей проект розповсюджується під ліцензією MIT. Дивіться файл LICENSE для детальної інформації.

---

**Автор:** Manus AI  
**Дата створення:** Січень 2024  
**Версія:** 1.0.0

