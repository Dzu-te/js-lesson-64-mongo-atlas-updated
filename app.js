import express from 'express';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';

dotenv.config();

const MONGO_CONNECTION = process.env.MONGO_CONNECTION;
const PORT = process.env.PORT || 3000;

const client = new MongoClient(MONGO_CONNECTION);

const app = express();
app.use(express.json());

let db;

app.get('/', (req, res) => {
  res.json({
    message: 'MongoDB Atlas Express API',
    endpoints: {
      'GET /theaters': 'Отримати театри',
      'GET /comments': 'Отримати коментарі',
      'GET /embedded_movies': 'Отримати вбудовані фільми',
      'GET /movies': 'Отримати фільми',
      'GET /movies/projection?fields=title,year': 'Отримати фільми з проекцією полів',
      'POST /movies': 'Створити новий фільм',
      'POST /movies/many': 'Створити багато фільмів',
      'PUT /movies/:id': 'Оновити фільм за ID',
      'PUT /movies': 'Оновити багато фільмів (потрібен filter та update в body)',
      'PUT /movies/:id/replace': 'Замінити фільм за ID',
      'DELETE /movies/:id': 'Видалити фільм за ID',
      'DELETE /movies': 'Видалити багато фільмів (потрібен filter в body)'
    }
  });
});

app.get('/theaters', async (req, res) => {
  const theatersCollection = await db.collection('theaters').find().limit(10).toArray();
  console.log('theatersCollection', theatersCollection);
  res.json(theatersCollection);
});

app.get('/comments', async (req, res) => {
  const commentsCollection = await db.collection('comments').find().limit(10).toArray();
  console.log('commentsCollection', commentsCollection);
  res.json(commentsCollection);
});

app.get('/embedded_movies', async (req, res) => {
  const embedded_movies = await db.collection('embedded_movies').find().limit(10).toArray();
  console.log('embedded_movies', embedded_movies);
  res.json(embedded_movies);
});

app.get('/movies', async (req, res) => {
  const moviesCollection = await db.collection('movies').find().limit(10).toArray();
  console.log('moviesCollection', moviesCollection);
  res.json(moviesCollection);
});

// Розширене читання з проекцією
app.get('/movies/projection', async (req, res) => {
  try {
    const { fields } = req.query;
    let projection = {};
    
    if (fields) {
      const fieldArray = fields.split(',');
      fieldArray.forEach(field => {
        projection[field.trim()] = 1;
      });
    }
    
    const moviesCollection = await db.collection('movies')
      .find({}, { projection })
      .limit(10)
      .toArray();
    
    console.log('moviesCollection with projection', moviesCollection);
    res.json(moviesCollection);
  } catch (error) {
    console.error('Error in movies projection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Створення одного документа (insertOne)
app.post('/movies', async (req, res) => {
  try {
    const newMovie = req.body;
    const result = await db.collection('movies').insertOne(newMovie);
    console.log('Movie inserted:', result);
    res.status(201).json({ 
      message: 'Movie created successfully', 
      insertedId: result.insertedId 
    });
  } catch (error) {
    console.error('Error inserting movie:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Створення багатьох документів (insertMany)
app.post('/movies/many', async (req, res) => {
  try {
    const newMovies = req.body;
    if (!Array.isArray(newMovies)) {
      return res.status(400).json({ error: 'Request body must be an array' });
    }
    
    const result = await db.collection('movies').insertMany(newMovies);
    console.log('Movies inserted:', result);
    res.status(201).json({ 
      message: 'Movies created successfully', 
      insertedCount: result.insertedCount,
      insertedIds: result.insertedIds 
    });
  } catch (error) {
    console.error('Error inserting movies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Оновлення одного документа (updateOne)
app.put('/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const result = await db.collection('movies').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    console.log('Movie updated:', result);
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    
    res.json({ 
      message: 'Movie updated successfully', 
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Оновлення багатьох документів (updateMany)
app.put('/movies', async (req, res) => {
  try {
    const { filter, update } = req.body;
    
    if (!filter || !update) {
      return res.status(400).json({ error: 'Filter and update fields are required' });
    }
    
    const result = await db.collection('movies').updateMany(filter, { $set: update });
    console.log('Movies updated:', result);
    
    res.json({ 
      message: 'Movies updated successfully', 
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    console.error('Error updating movies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Заміна одного документа (replaceOne)
app.put('/movies/:id/replace', async (req, res) => {
  try {
    const { id } = req.params;
    const replacementData = req.body;
    
    const result = await db.collection('movies').replaceOne(
      { _id: new ObjectId(id) },
      replacementData
    );
    
    console.log('Movie replaced:', result);
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    
    res.json({ 
      message: 'Movie replaced successfully', 
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    console.error('Error replacing movie:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Видалення одного документа (deleteOne)
app.delete('/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.collection('movies').deleteOne(
      { _id: new ObjectId(id) }
    );
    
    console.log('Movie deleted:', result);
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    
    res.json({ 
      message: 'Movie deleted successfully', 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Видалення багатьох документів (deleteMany)
app.delete('/movies', async (req, res) => {
  try {
    const { filter } = req.body;
    
    if (!filter) {
      return res.status(400).json({ error: 'Filter field is required' });
    }
    
    const result = await db.collection('movies').deleteMany(filter);
    console.log('Movies deleted:', result);
    
    res.json({ 
      message: 'Movies deleted successfully', 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('Error deleting movies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function startServer() {
  try {

    await client.connect();
    console.log('Connected to MongoDB');

    db = client.db('sample_mflix');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error', error);
  }
}

startServer();