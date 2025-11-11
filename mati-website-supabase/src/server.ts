import express from 'express';
import { createClient } from '@supabase/supabase-js';
import authRoutes from './api/auth';
import userRoutes from './api/users';
import profileRoutes from './api/profiles';
import postRoutes from './api/posts';
import mediaRoutes from './api/media';
import { supabaseUrl, supabaseKey } from './supabaseClient';

const app = express();
const port = process.env.PORT || 3000;

const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/media', mediaRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});