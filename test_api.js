// Тестовий файл для перевірки всіх ендпоінтів API
const BASE_URL = 'http://localhost:3003';

// Функція для виконання HTTP запитів
async function makeRequest(url, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { error: error.message };
  }
}

// Тестові функції
async function testGetMovies() {
  console.log('\n=== Тест GET /movies ===');
  const result = await makeRequest(`${BASE_URL}/movies`);
  console.log('Status:', result.status);
  console.log('Data:', result.data?.slice(0, 2)); // Показуємо тільки перші 2 фільми
}

async function testGetMoviesWithProjection() {
  console.log('\n=== Тест GET /movies/projection ===');
  const result = await makeRequest(`${BASE_URL}/movies/projection?fields=title,year,genres`);
  console.log('Status:', result.status);
  console.log('Data:', result.data?.slice(0, 2));
}

async function testCreateMovie() {
  console.log('\n=== Тест POST /movies ===');
  const newMovie = {
    title: 'Test Movie',
    year: 2024,
    genres: ['Drama', 'Test'],
    plot: 'This is a test movie for API testing',
    runtime: 120
  };
  
  const result = await makeRequest(`${BASE_URL}/movies`, 'POST', newMovie);
  console.log('Status:', result.status);
  console.log('Data:', result.data);
  
  // Зберігаємо ID створеного фільму для подальших тестів
  if (result.data?.insertedId) {
    global.testMovieId = result.data.insertedId;
  }
  
  return result.data?.insertedId;
}

async function testCreateManyMovies() {
  console.log('\n=== Тест POST /movies/many ===');
  const newMovies = [
    {
      title: 'Test Movie 1',
      year: 2024,
      genres: ['Action', 'Test'],
      plot: 'First test movie',
      runtime: 90
    },
    {
      title: 'Test Movie 2',
      year: 2024,
      genres: ['Comedy', 'Test'],
      plot: 'Second test movie',
      runtime: 110
    }
  ];
  
  const result = await makeRequest(`${BASE_URL}/movies/many`, 'POST', newMovies);
  console.log('Status:', result.status);
  console.log('Data:', result.data);
  
  return result.data?.insertedIds;
}

async function testUpdateMovie(movieId) {
  console.log('\n=== Тест PUT /movies/:id ===');
  const updateData = {
    plot: 'Updated plot for test movie',
    runtime: 130
  };
  
  const result = await makeRequest(`${BASE_URL}/movies/${movieId}`, 'PUT', updateData);
  console.log('Status:', result.status);
  console.log('Data:', result.data);
}

async function testUpdateManyMovies() {
  console.log('\n=== Тест PUT /movies ===');
  const updateData = {
    filter: { genres: 'Test' },
    update: { updated: true, updatedAt: new Date().toISOString() }
  };
  
  const result = await makeRequest(`${BASE_URL}/movies`, 'PUT', updateData);
  console.log('Status:', result.status);
  console.log('Data:', result.data);
}

async function testReplaceMovie(movieId) {
  console.log('\n=== Тест PUT /movies/:id/replace ===');
  const replacementData = {
    title: 'Completely New Movie',
    year: 2025,
    genres: ['Sci-Fi', 'Replaced'],
    plot: 'This movie was completely replaced',
    runtime: 150,
    replaced: true
  };
  
  const result = await makeRequest(`${BASE_URL}/movies/${movieId}/replace`, 'PUT', replacementData);
  console.log('Status:', result.status);
  console.log('Data:', result.data);
}

async function testDeleteMovie(movieId) {
  console.log('\n=== Тест DELETE /movies/:id ===');
  const result = await makeRequest(`${BASE_URL}/movies/${movieId}`, 'DELETE');
  console.log('Status:', result.status);
  console.log('Data:', result.data);
}

async function testDeleteManyMovies() {
  console.log('\n=== Тест DELETE /movies ===');
  const deleteData = {
    filter: { genres: 'Test' }
  };
  
  const result = await makeRequest(`${BASE_URL}/movies`, 'DELETE', deleteData);
  console.log('Status:', result.status);
  console.log('Data:', result.data);
}

// Основна функція тестування
async function runAllTests() {
  console.log('Початок тестування API...\n');
  
  try {
    // Тестуємо читання
    await testGetMovies();
    await testGetMoviesWithProjection();
    
    // Тестуємо створення
    const movieId = await testCreateMovie();
    const movieIds = await testCreateManyMovies();
    
    if (movieId) {
      // Тестуємо оновлення
      await testUpdateMovie(movieId);
      await testUpdateManyMovies();
      
      // Тестуємо заміну
      await testReplaceMovie(movieId);
      
      // Тестуємо видалення одного
      await testDeleteMovie(movieId);
    }
    
    // Тестуємо видалення багатьох
    await testDeleteManyMovies();
    
    console.log('\n=== Тестування завершено ===');
    
  } catch (error) {
    console.error('Помилка під час тестування:', error);
  }
}

// Запуск тестів
runAllTests();

