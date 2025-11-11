import { supabase } from '../supabaseClient';

export const getUserById = async (userId: string) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const updateUser = async (userId: string, updates: Partial<{ name: string; email: string; }>) => {
    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId);

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const deleteUser = async (userId: string) => {
    const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

    if (error) {
        throw new Error(error.message);
    }

    return true;
};