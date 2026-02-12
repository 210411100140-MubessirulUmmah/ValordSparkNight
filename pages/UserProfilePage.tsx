import React, { useState } from 'react'
import { UserProfile } from '../types'

interface UserProfilePageProps {
  user: UserProfile
  onUpdate: (updatedUser: UserProfile) => void
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState<UserProfile>(user)

  const [profileStatus, setProfileStatus] =
    useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  /* =====================
     UPDATE DATA TEXT ONLY
  ===================== */
  const handleSaveProfile = async () => {
    try {
      setProfileStatus('saving')

      // simulasi request
      await new Promise((r) => setTimeout(r, 600))

      onUpdate(formData)

      setProfileStatus('saved')
      setTimeout(() => setProfileStatus('idle'), 2000)
    } catch (err) {
      console.error(err)
      setProfileStatus('error')
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-8 md:py-12 px-4 md:px-6">
      <div className="bg-white rounded-[3rem] md:rounded-[4rem] shadow-2xl shadow-red-100/50 border border-red-50 overflow-hidden">

        {/* HEADER */}
        <div className="h-48 bg-gradient-to-r from-[#8B0000] to-red-900 relative">
          <div className="absolute inset-0 bg-white/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
        </div>

        <div className="px-6 md:px-12 pb-12">

          {/* PROFILE TOP */}
          <div className="relative -mt-24 mb-10 flex flex-col md:flex-row items-center md:items-end md:justify-between gap-6 text-center md:text-left">

            {/* PHOTO (READ ONLY) */}
            <div className="relative mx-auto md:mx-0 cursor-not-allowed opacity-90">
              <img
                src={formData.photoUrl}
                alt={formData.name}
                className="w-40 h-40 md:w-48 md:h-48 rounded-[3rem] object-cover border-[8px] md:border-[10px] border-white shadow-2xl"
              />

              <button
                type="button"
                disabled
                className="absolute bottom-2 right-2 bg-gray-300 text-gray-600 px-3 py-2 rounded-xl shadow-lg text-[10px] font-black uppercase tracking-widest border-4 border-white cursor-not-allowed"
              >
                Locked 🔒
              </button>
            </div>

            {/* NAME */}
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-header uppercase tracking-tighter text-gray-900">
                {formData.name}
              </h2>
              <p className="text-[#8B0000] text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                • {formData.job}
              </p>
            </div>

            {/* ACTION */}
            <div className="flex flex-col items-center gap-3 w-full md:w-auto">

              {profileStatus === 'saved' && (
                <span className="text-green-600 text-[10px] font-black uppercase tracking-widest">
                  ✓ Profile Saved
                </span>
              )}

              <button
                onClick={handleSaveProfile}
                disabled={profileStatus === 'saving'}
                className="w-full md:w-auto bg-[#8B0000] text-white px-8 py-4 rounded-[2rem] font-header uppercase tracking-widest text-sm shadow-xl hover:bg-black transition-all disabled:opacity-50"
              >
                {profileStatus === 'saving' ? 'Saving…' : 'Update Profil'}
              </button>
            </div>
          </div>

          {/* CONTENT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* LEFT */}
            <div className="lg:col-span-7 space-y-8">
              <div className="bg-red-50/30 p-8 md:p-10 rounded-[2.5rem] border border-red-100">
                <h3 className="text-lg md:text-xl font-header uppercase mb-8">
                  🧧 Personal Identification
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Public Name"
                    value={formData.name}
                    onChange={(v: string) => setFormData({ ...formData, name: v })}
                  />

                  <Input
                    label="Age"
                    type="number"
                    value={formData.age}
                    onChange={(v: string) =>
                      setFormData({ ...formData, age: Number(v) })
                    }
                  />

                  <Input
                    label="Main Profession"
                    value={formData.job}
                    onChange={(v: string) => setFormData({ ...formData, job: v })}
                  />
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-5">
              <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h3 className="text-lg font-header uppercase mb-4">
                  Your Chindo Bio
                </h3>
                <textarea
                  rows={5}
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  className="w-full px-6 py-5 rounded-2xl bg-gray-50 border border-gray-100 text-sm italic focus:ring-4 focus:ring-red-100 outline-none resize-none"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

/* =====================
   SMALL INPUT HELPER
===================== */
const Input = ({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  value: any
  onChange: (v: string) => void
  type?: string
}) => (
  <div>
    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-2">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-5 py-4 rounded-2xl border border-gray-100 font-bold text-gray-700 focus:ring-4 focus:ring-red-100 outline-none"
    />
  </div>
)
