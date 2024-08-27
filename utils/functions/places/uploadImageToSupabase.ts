const uploadImageToSupabase = async (imageUrl: string, imgName: string) => {
  try {
    const response = await fetch('/api/supabase/upload-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl, imgName }),
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const result = await response.json();
    console.log('Image upload result:', result);

    return result.success; 
  } catch (error) {
    console.log('Error in uploadImageToSupabase:', error);
    return false;
  }
};

export default uploadImageToSupabase;
