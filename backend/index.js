const fastify = require('fastify')({ logger: true });
const fastifyJWT = require('@fastify/jwt');
const fastifyCors = require('@fastify/cors');
const { Client } = require('pg');

fastify.register(fastifyCors);
fastify.register(fastifyJWT, { secret: 'supersecret' });




const db = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'blog_platform',
  password: 'Asha2812@',
  port: 5432,
});
db.connect();

// Register user
fastify.post('/register', async (req, reply) => {
  const { username, password } = req.body;
  await db.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, password]);
  reply.send({ msg: 'User registered' });
});

// Login user
fastify.post('/login', async (req, reply) => {
  const { username, password } = req.body;
  const res = await db.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
  if (res.rows.length) {
    const token = fastify.jwt.sign({ username });
    reply.send({ token });
  } else {
    reply.code(401).send({ msg: 'Invalid credentials' });
  }
});

// Create post (auth required)
fastify.post('/posts', async (req, reply) => {
  try {
    await req.jwtVerify();
    const { title, content } = req.body;
    const author = req.user.username;

    const result = await db.query(
      'INSERT INTO posts (title, content, author) VALUES ($1, $2, $3) RETURNING *',
      [title, content, author]
    );

    reply.send(result.rows[0]);
  } catch (err) {
    reply.code(401).send({ msg: 'Unauthorized or invalid token' });
  }
});

// Get all posts
fastify.get('/posts', async (req, reply) => {
  const res = await db.query('SELECT * FROM posts ORDER BY id DESC');
  reply.send(res.rows);
});

// Delete post (auth required)
fastify.delete('/posts/:id', async (req, reply) => {
  try {
    await req.jwtVerify();

    const { id } = req.params;
    const author = req.user.username;

    // Check post ownership
    const existing = await db.query('SELECT * FROM posts WHERE id = $1', [id]);
    if (!existing.rows.length) {
      return reply.code(404).send({ msg: 'Post not found' });
    }

    if (existing.rows[0].author !== author) {
      return reply.code(403).send({ msg: 'You can only delete your own posts' });
    }

    await db.query('DELETE FROM posts WHERE id = $1', [id]);
    reply.send({ msg: 'Post deleted' });
  } catch (err) {
    reply.code(401).send({ msg: 'Unauthorized or invalid token' });
  }
});


// Edit post (auth required)
fastify.put('/posts/:id', async (req, reply) => {
  try {
    await req.jwtVerify();

    const { id } = req.params;
    const { title, content } = req.body;
    const author = req.user.username;

    const existing = await db.query('SELECT * FROM posts WHERE id = $1', [id]);
    if (!existing.rows.length) {
      return reply.code(404).send({ msg: 'Post not found' });
    }

    if (existing.rows[0].author !== author) {
      return reply.code(403).send({ msg: 'You can only edit your own posts' });
    }

    const updated = await db.query(
      'UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *',
      [title, content, id]
    );

    reply.send(updated.rows[0]);
  } catch (err) {
    console.error(err);
    reply.code(401).send({ msg: 'Unauthorized or invalid token' });
  }
});


fastify.listen({ port: 3001 }, err => {
  if (err) throw err;
  console.log('Server running on port 3001');
});



