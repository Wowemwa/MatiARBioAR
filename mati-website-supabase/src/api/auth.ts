import { createClient } from '@supabase/supabase-js';
import { Request, Response } from 'express';
import { supabase } from '../supabaseClient';

export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const { user, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({ user });
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const { user, error } = await supabase.auth.signIn({
        email,
        password,
    });

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ user });
};

export const logout = async (req: Request, res: Response) => {
    const { error } = await supabase.auth.signOut();

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ message: 'Logged out successfully' });
};

export const getUser = async (req: Request, res: Response) => {
    const user = supabase.auth.user();

    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    return res.status(200).json({ user });
};