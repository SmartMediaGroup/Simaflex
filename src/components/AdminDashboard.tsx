import React, { useState, useEffect, useRef } from 'react';
import { auth, db, handleFirestoreError, OperationType } from '../services/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { blogArticles } from "../data/blogData"; // For bootstrapping
import { productsData } from "../App";
import { Trash2, Edit2, Plus, LogOut, Loader2, Save, X, CheckCircle2 } from 'lucide-react';
import JoditEditor from 'jodit-react';

type AdminTab = 'products' | 'articles';

export const AdminDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [items, setItems] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newFeature, setNewFeature] = useState('');
  const editor = useRef(null);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const colRef = collection(db, activeTab);
      const snapshot = await getDocs(colRef);
      const data = snapshot.docs.map(doc => {
         const docData = doc.data();
         let img = docData.image;
         
         // Repoint properly to dev asset bundle if legacy path was saved
         if (activeTab === 'articles' && img && typeof img === 'string' && img.startsWith('/src/assets/')) {
             const filenameMatch = img.match(/\/([^\/]+)\.[a-z0-9]+$/i);
             if (filenameMatch) {
                 const filenamePrefix = filenameMatch[1];
                 const localArticle = blogArticles.find(a => a.image && typeof a.image === 'string' && a.image.includes(filenamePrefix));
                 if (localArticle) {
                     img = localArticle.image; // Properly bundled object
                 }
             }
         }
         
         return { 
           id: doc.id, 
           ...docData,
           image: img 
         };
      });
      setItems(data);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, activeTab);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = () => signOut(auth);

  const handleAddNew = () => {
    setEditingItem({
      id: Date.now().toString(),
      ...(activeTab === 'products' ? {
        title: '',
        category: '',
        subtitle: '',
        fullDesc: '',
        price: '',
        image: '',
        badge: '',
        isFeatured: false,
        features: [],
      } : {
        title: '',
        content: '',
        slug: '',
        excerpt: '',
        image: ''
      })
    });
    setNewFeature('');
    setIsEditing(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem({ ...item, features: item.features || [] });
    setNewFeature('');
    setIsEditing(true);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setEditingItem({
        ...editingItem,
        features: [...(editingItem.features || []), newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = [...(editingItem.features || [])];
    updatedFeatures.splice(index, 1);
    setEditingItem({ ...editingItem, features: updatedFeatures });
  };

  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      
      // Client-side compression
      const compressedFile = await new Promise<File>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target?.result as string;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const max_size = 1200;
            
            if (width > height) {
              if (width > max_size) {
                height *= max_size / width;
                width = max_size;
              }
            } else {
              if (height > max_size) {
                width *= max_size / height;
                height = max_size;
              }
            }
            
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            
            canvas.toBlob((blob) => {
              if (blob) {
                // Return optimized WebP image
                resolve(new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", { type: 'image/webp' }));
              } else {
                reject(new Error("Canvas to Blob failed"));
              }
            }, 'image/webp', 0.8);
          };
          img.onerror = () => reject(new Error("Image load failed"));
        };
        reader.onerror = () => reject(new Error("FileReader failed"));
      });

      const formData = new FormData();
      formData.append("image", compressedFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse JSON, received text:", text);
        throw new Error("Erreur de format de réponse du serveur");
      }

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'upload");
      }

      setEditingItem({...editingItem, image: data.url});
    } catch (error) {
      console.error("Upload error:", error);
      alert("Erreur lors de l'upload de l'image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const colRef = collection(db, activeTab);
      const docRef = doc(colRef, editingItem.id);
      
      const saveData = { ...editingItem };
      delete saveData.id;
      
      if (!saveData.createdAt) {
        saveData.createdAt = Date.now();
      }
      saveData.updatedAt = Date.now();

      await setDoc(docRef, saveData, { merge: true });
      setIsEditing(false);
      setEditingItem(null);
      await fetchData();
    } catch (error) {
       handleFirestoreError(error, OperationType.WRITE, `${activeTab}/${editingItem.id}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, activeTab, id));
      await fetchData();
    } catch (error) {
       handleFirestoreError(error, OperationType.DELETE, `${activeTab}/${id}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return <div className="min-h-screen flex items-center justify-center pt-24"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-[#2A1659]">Espace Administrateur</h2>
          <p className="mb-8 text-gray-600">Connectez-vous pour gérer le contenu de Simaflex.</p>
          <button
            onClick={handleLogin}
            className="w-full py-3 px-4 bg-[#FF570A] text-white rounded-lg font-medium hover:bg-[#e04c08] transition-colors"
          >
            Connexion avec Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#2A1659]">Tableau de Bord</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{user.email}</span>
            <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => { setActiveTab('products'); setIsEditing(false); }}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${activeTab === 'products' ? 'bg-[#2A1659] text-white' : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm border border-gray-200'}`}
          >
            Produits
          </button>
          <button
            onClick={() => { setActiveTab('articles'); setIsEditing(false); }}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${activeTab === 'articles' ? 'bg-[#2A1659] text-white' : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm border border-gray-200'}`}
          >
            Articles
          </button>
        </div>

        {isEditing ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#2A1659]">
                  {editingItem.id ? 'Modifier' : 'Ajouter'} {activeTab === 'products' ? 'un produit' : 'un article'}
                </h2>
                <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
             </div>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                  <input
                    type="text"
                    value={editingItem.title || ''}
                    onChange={e => setEditingItem({...editingItem, title: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF570A] outline-none"
                    required
                  />
                </div>
                
                {activeTab === 'products' && (
                  <>
                     <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                      <input
                        type="text"
                        value={editingItem.category || ''}
                        onChange={e => setEditingItem({...editingItem, category: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF570A] outline-none"
                        required
                        placeholder="Matelas, Salons, Linge de lit..."
                      />
                    </div>
                  </>
                )}

                {activeTab === 'products' && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Caractéristiques</label>
                    <div className="space-y-3 mb-4">
                      {editingItem.features?.map((feat: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                          <CheckCircle2 className="w-5 h-5 text-[#FF570A] shrink-0" />
                          <span className="flex-1 text-sm text-gray-700">{feat}</span>
                          <button
                            type="button"
                            onClick={() => removeFeature(idx)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newFeature}
                        onChange={e => setNewFeature(e.target.value)}
                        placeholder="Ex: Hauteur : 25 cm, Garantie : 5 ans..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF570A] outline-none"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addFeature();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={addFeature}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors border border-gray-300 flex items-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        Ajouter
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'articles' && (
                   <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Extrait (Excerpt)</label>
                    <textarea
                      value={editingItem.excerpt || ''}
                      onChange={e => setEditingItem({...editingItem, excerpt: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF570A] outline-none"
                      rows={2}
                    />
                  </div>
                )}
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image (URL ou Upload)</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="text"
                      value={editingItem.image || ''}
                      onChange={e => setEditingItem({...editingItem, image: e.target.value})}
                      placeholder="URL ou chemin de l'image (/uploads/...)"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF570A] outline-none"
                    />
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploadingImage}
                      />
                      <button
                        type="button"
                        disabled={uploadingImage}
                        className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors border border-gray-300 flex items-center justify-center gap-2"
                      >
                        {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Uploader une image'}
                      </button>
                    </div>
                  </div>
                  {editingItem.image && (
                    <div className="mt-4">
                      <img src={editingItem.image} alt="Aperçu" className="h-32 rounded object-contain bg-gray-50 border border-gray-200" />
                    </div>
                  )}
                </div>

                {activeTab === 'products' && (
                   <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description détaillée</label>
                    <div className="prose max-w-none">
                       <JoditEditor
                          ref={editor}
                          value={editingItem.fullDesc || ''}
                          config={{ readonly: false, height: 400 }}
                          onBlur={newContent => setEditingItem({...editingItem, fullDesc: newContent})}
                          onChange={newContent => setEditingItem({...editingItem, fullDesc: newContent})}
                       />
                    </div>
                  </div>
                )}

                {activeTab === 'articles' && (
                   <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contenu Détaillé</label>
                    <div className="prose max-w-none">
                       <JoditEditor
                          ref={editor}
                          value={editingItem.content || ''}
                          config={{ readonly: false, height: 400 }}
                          onBlur={newContent => setEditingItem({...editingItem, content: newContent})}
                          onChange={newContent => setEditingItem({...editingItem, content: newContent})}
                       />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-[#FF570A] text-white rounded-lg font-medium hover:bg-[#e04c08] transition-colors flex items-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={18} />}
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
              <h2 className="text-xl font-bold text-gray-800">
                Liste des {activeTab === 'products' ? 'Produits' : 'Articles'}
              </h2>
              <div className="flex items-center gap-4">
                {items.length === 0 && (
                   <button
                   onClick={async () => {
                     setLoading(true);
                     try {
                        const { blogArticles } = await import('../data/blogData');
                        const { productsData } = await import('../App');
                        const colRef = collection(db, activeTab);
                        const sourceData = activeTab === 'products' ? productsData : blogArticles;
                        
                        for (const sourceItem of sourceData) {
                           const item: any = sourceItem;
                           const docRef = doc(colRef, String(item.id || item.slug || Date.now()));
                           const saveData: any = {
                             createdAt: Date.now(),
                             updatedAt: Date.now(),
                           };
                           
                           if (activeTab === 'products') {
                               saveData.title = item.name || 'Produit sans nom';
                               saveData.category = item.category || 'Matelas';
                               if (item.desc) saveData.subtitle = item.desc;
                               if (item.price) saveData.price = item.price;
                               if (item.img) saveData.image = item.img;
                               if (item.badge) saveData.badge = item.badge;
                               if (item.features) saveData.features = item.features;
                               if (item.isFeatured !== undefined) saveData.isFeatured = item.isFeatured;
                           } else if (activeTab === 'articles') {
                               saveData.title = item.title || 'Article sans titre';
                               saveData.content = item.content || '...';
                               if (item.slug) saveData.slug = item.slug;
                               if (item.excerpt) saveData.excerpt = item.excerpt;
                               if (item.image) saveData.image = typeof item.image === 'string' ? item.image : String(item.image);
                           }
                           
                           await setDoc(docRef, saveData, { merge: true });
                        }
                        await fetchData();
                     } catch(e) {
                         console.error('Error bootstrapping', e);
                         // Removed alert because of iframe
                     } finally {
                        setLoading(false);
                     }
                   }}
                   className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-bold hover:bg-orange-200 transition-colors text-sm border border-orange-200"
                 >
                   Importer les données du site
                 </button>
                )}
                <button
                  onClick={handleAddNew}
                  className="flex items-center gap-2 px-4 py-2 bg-[#2A1659] text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors text-sm"
                >
                  <Plus size={18} /> Ajouter
                </button>
              </div>
            </div>
            
            {loading ? (
              <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
            ) : items.length === 0 ? (
              <div className="p-12 text-center text-gray-500">Aucun élément trouvé.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-sm">
                      <th className="p-4 font-medium">Image</th>
                      <th className="p-4 font-medium">Titre</th>
                      {activeTab === 'products' && <th className="p-4 font-medium">Catégorie</th>}
                      <th className="p-4 font-medium">Date de maj</th>
                      <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="p-4">
                           {item.image ? (
                             <img src={item.image} alt={item.title} className="w-12 h-12 rounded object-cover" />
                           ) : (
                             <div className="w-12 h-12 rounded bg-gray-200"></div>
                           )}
                        </td>
                        <td className="p-4 font-medium text-gray-800">{item.title}</td>
                        {activeTab === 'products' && <td className="p-4 text-gray-600">{item.category}</td>}
                        <td className="p-4 text-gray-500 text-sm">
                          {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="p-4 text-right">
                          <button onClick={() => handleEdit(item)} className="p-2 text-gray-400 hover:text-[#2A1659] transition-colors rounded">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
