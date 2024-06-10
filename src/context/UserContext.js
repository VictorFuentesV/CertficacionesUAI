import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('userinfo')
          .select('*')
          .eq('userid', user.id)
          .single();
        if (error) {
          console.error('Error fetching user info:', error);
        } else {
          setUserInfo(data);
        }
      }
    };
    fetchUserInfo();
  }, [user]);

  const fetchPdfs = async () => {
    if (user) {
      const { data, error } = await supabase.storage.from('pdf').list(`${user.id}/`, {
        limit: 10,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });
      if (error) {
        console.error('Error fetching PDFs:', error);
      } else {
        setPdfs(data);
      }
    }
  };

  useEffect(() => {
    fetchPdfs();
  }, [user]);

  const addPdf = async (file, fileName) => {
    if (user) {
      const { data, error } = await supabase
        .storage
        .from('pdf')
        .upload(`${user.id}/${fileName}`, file);
      if (data) {
        await fetchPdfs(); // Actualizar la lista de archivos PDF después de agregar uno nuevo
      } else {
        console.error('Error uploading PDF:', error);
      }
    }
  };

  const deletePdf = async (pdf) => {
    if (user) {
      const { error } = await supabase.storage.from('pdf').remove([`${user.id}/${pdf.name}`]);
      if (!error) {
        await fetchPdfs(); // Actualizar la lista de archivos PDF después de eliminar uno
      } else {
        console.error('Error deleting PDF:', error);
      }
    }
  };

  const addUserInfo = async (name, lastname, career) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('userinfo')
        .insert({ userid: user.id, name, lastname, career });
      if (error) {
        console.error('Error adding user info:', error);
      } else {
        alert('Profile created successfully!');
      }
    } catch (error) {
      console.error('Error adding user info:', error);
    } finally {
      setLoading(false);
    }
  };



/* List all files from bucket */
const listFilesFromBucket = async (bucket) => {
  try {
    const { data, error } = await supabase.storage.from(bucket).list();
    if (error) throw new Error("No files found");
    return data;
  } catch (error) {
    console.error(error);
  }
};


/* Download file */
const downloadFileFromBucket = async (bucket, path) => {
  try {
    const { data, error } = await supabase.storage.from(bucket).download(path);
    if (error) throw new Error("Error downloading file");
    return data;
  } catch (error) {
    console.error(error);
  }
};

/* Get signed url of object from specific bucket */
const getSignedUrl = async (bucketId, path) => {
  try {
    const { signedURL, error } = await supabase.storage
      .from(bucketId)
      .createSignedUrl(path, 80);
    if (error) throw new Error("No files found");
    return signedURL;
  } catch (error) {
    console.error(error);
  }
};

  return (
    <UserContext.Provider value={{ user, userInfo, pdfs, setPdfs, addPdf, deletePdf, addUserInfo,getSignedUrl,downloadFileFromBucket,listFilesFromBucket, loading }}>
      {children}
    </UserContext.Provider>
  );
};
