import { Router } from 'express';
import { supabase } from '../supabaseClient';

const router = Router();

// Create a new post
router.post('/', async (req, res) => {
    const { title, content, userId } = req.body;
    const { data, error } = await supabase
        .from('posts')
        .insert([{ title, content, user_id: userId }]);

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
});

// Get all posts
router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('posts')
        .select('*');

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
});

// Get a single post by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return res.status(404).json({ error: error.message });
    res.status(200).json(data);
});

// Update a post
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const { data, error } = await supabase
        .from('posts')
        .update({ title, content })
        .eq('id', id);

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
});

// Delete a post
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

    if (error) return res.status(400).json({ error: error.message });
    res.status(204).send();
});

export default router;