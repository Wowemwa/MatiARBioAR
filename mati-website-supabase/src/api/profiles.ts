import { supabase } from '../supabaseClient';

export const createProfile = async (profileData) => {
    const { data, error } = await supabase
        .from('profiles')
        .insert([profileData]);
    return { data, error };
};

export const getProfile = async (id) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
    return { data, error };
};

export const updateProfile = async (id, profileData) => {
    const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', id);
    return { data, error };
};

export const deleteProfile = async (id) => {
    const { data, error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);
    return { data, error };
};