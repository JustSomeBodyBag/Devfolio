import { useState, useEffect } from 'react'
import axios from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import AvatarUploader from './AvatarUploader'
import SkillEditor from './SkillEditor'

interface HomePageContent {
  id?: number
  title: string
  subtitle?: string
  about?: string
  avatar_url?: string
}

export default function HomePageContentEditor() {
  const { token } = useAuth()
  const [content, setContent] = useState<HomePageContent>({
    title: '',
    subtitle: '',
    about: '',
    avatar_url: undefined,
  })
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [avatarError, setAvatarError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await axios.get<HomePageContent>('/homepage/', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = res.data
        setContent({
          title: data.title,
          subtitle: data.subtitle ?? '',
          about: data.about ?? '',
          avatar_url: data.avatar_url || undefined,
        })
        setIsEditing(true)
        setError(null)
      } catch {
        setError('Ошибка загрузки данных')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContent(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleAvatarUploadComplete = (avatarUrl: string) => {
    setContent(prev => ({ ...prev, avatar_url: avatarUrl || undefined }))
    setAvatarError(null)
  }

  const handleAvatarUploadError = (message: string) => {
    setAvatarError(message)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      title: content.title,
      subtitle: content.subtitle || undefined,
      about: content.about || undefined,
    }

    try {
      if (isEditing) {
        await axios.put('/homepage/', payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
      } else {
        await axios.post('/homepage/', payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setIsEditing(true)
      }
      alert('Сохранено')
    } catch {
      setError('Ошибка при сохранении')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Загрузка...</div>

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow space-y-10 box-border">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="text-red-600 font-semibold">{error}</div>}

        <div>
          <label htmlFor="title" className="block font-semibold mb-1">Заголовок</label>
          <input
            id="title"
            type="text"
            name="title"
            value={content.title}
            onChange={handleChange}
            required
            disabled={saving}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="subtitle" className="block font-semibold mb-1">Подзаголовок</label>
          <input
            id="subtitle"
            type="text"
            name="subtitle"
            value={content.subtitle}
            onChange={handleChange}
            disabled={saving}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="about" className="block font-semibold mb-1">О себе</label>
          <textarea
            id="about"
            name="about"
            value={content.about}
            onChange={handleChange}
            disabled={saving}
            rows={5}
            className="w-full border border-gray-300 rounded px-3 py-2 resize-y"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className={`w-full py-3 font-semibold rounded transition ${
            saving ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {saving ? 'Сохраняю...' : 'Сохранить'}
        </button>
      </form>

      <div>
        <label className="block font-semibold mb-2">Аватар</label>
        <AvatarUploader
          initialAvatarUrl={content.avatar_url || ''}
          onUploadComplete={handleAvatarUploadComplete}
          onUploadError={handleAvatarUploadError}
        />
        {avatarError && <p className="text-red-600 mt-2 font-semibold">{avatarError}</p>}
      </div>

      <div>
        <label className="block font-semibold mb-2 text-lg">Навыки</label>
        <SkillEditor />
      </div>
    </div>
  )
}
