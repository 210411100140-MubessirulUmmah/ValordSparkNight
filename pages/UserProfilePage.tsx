import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';

interface UserProfilePageProps {
  user: UserProfile;
  onUpdate: (updatedUser: UserProfile) => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState<UserProfile>(user);
  const [isImproving, setIsImproving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      onUpdate(formData);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 800);
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="bg-white rounded-[4rem] shadow-2xl shadow-red-100/50 border border-red-50 overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-[#8B0000] to-red-900 relative">
          <div className="absolute inset-0 opacity-10 bg-white/80"></div>
          <div className="absolute -bottom-1 top-0 left-0 right-0 bg-gradient-to-t from-white to-transparent"></div>
        </div>
        
        <div className="px-12 pb-12">
          <div className="relative -mt-24 mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="relative group cursor-pointer" onClick={handlePhotoClick}>
              <img 
                src={formData.photoUrl} 
                alt={formData.name} 
                className="w-48 h-48 rounded-[3.5rem] object-cover border-[10px] border-white shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 rounded-[3.5rem] z-15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <span className="text-white font-bold text-xs uppercase tracking-widest">Ganti Foto</span>
              </div>
              <button className="absolute bottom-2 right-2 z-20 bg-yellow-400 text-red-900 p-3 rounded-2xl shadow-xl hover:bg-yellow-300 transition-all font-bold text-[10px] uppercase tracking-widest border-4 border-white pointer-events-none">
                Edit 📸
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>
            
            <div className="flex-1 text-center md:text-left md:mb-4">
               <h2 className="text-4xl font-header text-gray-900 tracking-tighter uppercase">{formData.name}</h2>
               <p className="text-[#8B0000] font-black uppercase tracking-[0.2em] text-[10px]">• {formData.job}</p>
            </div>

            <div className="flex items-center space-x-4 mb-4">
              {saveStatus === 'saved' && (
                <span className="text-green-600 font-black text-[10px] uppercase tracking-widest flex items-center bg-green-50 px-5 py-2.5 rounded-2xl border border-green-100">
                  <span className="mr-2 text-lg">✓</span> Saved
                </span>
              )}
              <button 
                onClick={handleSave}
                disabled={saveStatus === 'saving'}
                className="bg-[#8B0000] text-white px-10 py-5 rounded-[2rem] font-header hover:bg-black transition-all disabled:opacity-50 shadow-2xl shadow-red-200 uppercase tracking-widest text-sm"
              >
                {saveStatus === 'saving' ? 'Saving...' : 'Update Profil'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-8">
              <div className="bg-red-50/20 p-10 rounded-[3rem] border border-red-50">
                <h3 className="text-xl font-header text-gray-900 mb-8 flex items-center uppercase tracking-tight">
                  <span className="mr-3">🧧</span> Personal Identification
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Public Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-red-100 outline-none transition-all font-bold text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Age</label>
                    <input 
                      type="number" 
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: parseInt(e.target.value) || 0})}
                      className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-red-100 outline-none transition-all font-bold text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Main Profession</label>
                    <input 
                      type="text" 
                      value={formData.job}
                      onChange={(e) => setFormData({...formData, job: e.target.value})}
                      className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-red-100 outline-none transition-all font-bold text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Instagram Username</label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-gray-400">@</span>
                      <input 
                        type="text" 
                        value={formData.igHandle}
                        onChange={(e) => setFormData({...formData, igHandle: e.target.value})}
                        className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-red-100 outline-none transition-all font-bold text-gray-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-8">
              <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-header text-gray-900 uppercase tracking-tight">Your Chindo Bio</h3>
                </div>
                <textarea 
                  rows={5}
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-[2rem] focus:ring-4 focus:ring-red-100 outline-none transition-all resize-none text-sm font-medium text-gray-600 italic"
                  placeholder="Ceritakan tentang dirimu..."
                />
                <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">Bio yang menarik mempercepat "Match"!</p>
              </div>

              <div className="bg-black p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="font-header text-lg mb-2 uppercase tracking-tight text-yellow-400">Valentine Tips</h4>
                  <p className="text-[11px] text-white/70 italic leading-relaxed">
                    "Dress Code: Red & Elegant.<br/>

                    Sebuah malam spektakuler Chindo Swipe menantimu di Pantai Indah Kapuk."
                  </p>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-yellow-400/5 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
