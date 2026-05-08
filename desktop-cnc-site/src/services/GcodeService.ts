import { supabase } from '../utils/supabase.js';

export const gcodeService = {
    /** WRITE: upload a file to the user's account. */
    async uploadGcode(file: File) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Authentication required");

        // path must start with user.id 
        const filePath = `${user.id}/${file.name}`;

        const { data, error } = await supabase.storage
            .from('documents')
            .upload(filePath, file, { 
                upsert: true 
            });

        if (error) throw error;
        return data;
    },

    /** READING: Fetch list of files in the user's account. */
    async listMyGcode() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase.storage
            .from('documents')
            .list(user.id, {
                sortBy: { column: 'name', order: 'asc' }
            });

        if (error) throw error;
        return data; 
    },

    /** DELETING: Removes file from user's account. */
    async deleteGcode(fileName: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Authentication required");

        const { error } = await supabase.storage
            .from('documents')
            .remove([`${user.id}/${fileName}`]);

        if (error) throw error;
    },
    
   /** DOWNLOADING: Retrieves the file from user's account. */
  async downloadFile(fileName: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const filePath = `${user.id}/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('documents')
      .download(filePath);

    if (error) throw error;
    return data; 
  }
};