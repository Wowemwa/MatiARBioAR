import { Router } from 'express';
import { supabase } from '../supabaseClient';

const router = Router();

// Upload media
router.post('/upload', async (req, res) => {
    const { file } = req.body;

    const { data, error } = await supabase.storage.from('media').upload(file.name, file);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ data });
});

// Retrieve media
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase.storage.from('media').download(id);

    if (error) {
        return res.status(404).json({ error: error.message });
    }

    res.status(200).send(data);
});

// Delete media
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    const { error } = await supabase.storage.from('media').remove([id]);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.status(204).send();
});

export default router;