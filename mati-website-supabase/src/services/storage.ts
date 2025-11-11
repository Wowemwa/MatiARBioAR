import { supabase } from '../supabaseClient';

export const uploadFile = async (file: File, path: string) => {
    const { data, error } = await supabase.storage.from('your-bucket-name').upload(path, file);
    if (error) {
        throw new Error(`Error uploading file: ${error.message}`);
    }
    return data;
};

export const getFileUrl = (path: string) => {
    const { publicURL, error } = supabase.storage.from('your-bucket-name').getPublicUrl(path);
    if (error) {
        throw new Error(`Error getting file URL: ${error.message}`);
    }
    return publicURL;
};

export const deleteFile = async (path: string) => {
    const { error } = await supabase.storage.from('your-bucket-name').remove([path]);
    if (error) {
        throw new Error(`Error deleting file: ${error.message}`);
    }
};