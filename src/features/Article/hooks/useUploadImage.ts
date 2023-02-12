import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
export const useUploadImage = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = useCallback(async (file: File) => {
    setIsUploading(true);
    const { data, error } = await supabase.storage
      .from("images-in-article")
      .upload(file.name, file);
    if (!data && error) {
      setIsUploading(false);
      return { error: error.message };
    }
    const {
      data: { publicUrl },
    } = await supabase.storage
      .from("images-in-article")
      .getPublicUrl(data.path);
    setIsUploading(false);
    return { publicUrl };
  }, []);

  return { uploadImage, isUploading };
};
