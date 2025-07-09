import { useEffect, useState } from 'react'
import axios from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

interface Skill {
  id: number
  name: string
  level: number
}

export default function SkillEditor() {
  const { token } = useAuth()
  const [skills, setSkills] = useState<Skill[]>([])
  const [newSkillName, setNewSkillName] = useState('')
  const [newSkillLevel, setNewSkillLevel] = useState<number>(0)
  const [editSkillId, setEditSkillId] = useState<number | null>(null)
  const [editSkillName, setEditSkillName] = useState('')
  const [editSkillLevel, setEditSkillLevel] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/admin/skills/admin/skills/', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSkills(res.data)
      setError(null)
    } catch {
      setError('Ошибка загрузки навыков')
    } finally {
      setLoading(false)
    }
  }

  const addSkill = async () => {
    if (!newSkillName.trim()) return
    setSaving(true)
    try {
      const res = await axios.post('/admin/skills/admin/skills/', {
        name: newSkillName.trim(),
        level: newSkillLevel,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSkills(prev => [...prev, res.data])
      setNewSkillName('')
      setNewSkillLevel(0)
    } catch {
      setError('Ошибка при добавлении навыка')
    } finally {
      setSaving(false)
    }
  }

  const startEditing = (skill: Skill) => {
    setEditSkillId(skill.id)
    setEditSkillName(skill.name)
    setEditSkillLevel(skill.level)
  }

  const saveEdit = async () => {
    if (editSkillId === null || !editSkillName.trim()) return
    setSaving(true)
    try {
      await axios.put(`/admin/skills/admin/skills/${editSkillId}`, {
        name: editSkillName.trim(),
        level: editSkillLevel,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSkills(prev =>
        prev.map(skill =>
          skill.id === editSkillId
            ? { ...skill, name: editSkillName.trim(), level: editSkillLevel }
            : skill
        )
      )
      setEditSkillId(null)
      setEditSkillName('')
      setEditSkillLevel(0)
    } catch {
      setError('Ошибка при редактировании')
    } finally {
      setSaving(false)
    }
  }

  const deleteSkill = async (id: number) => {
    if (!confirm('Удалить этот навык?')) return
    setSaving(true)
    try {
      await axios.delete(`/admin/skills/admin/skills/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSkills(prev => prev.filter(skill => skill.id !== id))
    } catch {
      setError('Ошибка при удалении')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow space-y-6 box-border">
      <h2 className="text-xl font-bold text-gray-800">Навыки</h2>
      {error && <p className="text-red-600 font-semibold">{error}</p>}
      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <>
          <ul className="space-y-4">
            {skills.map(skill => (
              <li key={skill.id} className="flex items-center space-x-4">
                {editSkillId === skill.id ? (
                  <>
                    <input
                      type="text"
                      value={editSkillName}
                      onChange={(e) => setEditSkillName(e.target.value)}
                      className="flex-grow min-w-0 border rounded px-3 py-2 box-border"
                      disabled={saving}
                    />
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editSkillLevel}
                      onChange={(e) => setEditSkillLevel(Number(e.target.value))}
                      className="w-20 border rounded px-2 py-2 text-center box-border"
                      disabled={saving}
                    />
                    <button
                      onClick={saveEdit}
                      disabled={saving}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      Сохранить
                    </button>
                    <button
                      onClick={() => setEditSkillId(null)}
                      disabled={saving}
                      className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 disabled:opacity-50"
                    >
                      Отмена
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 min-w-0">{skill.name}</span>
                    <span className="w-20 text-center">{skill.level}</span>
                    <button
                      onClick={() => startEditing(skill)}
                      disabled={saving}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => deleteSkill(skill.id)}
                      disabled={saving}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      Удалить
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center space-x-4 mt-6">
            <input
              type="text"
              placeholder="Новый навык"
              value={newSkillName}
              onChange={e => setNewSkillName(e.target.value)}
              className="flex-grow min-w-0 border rounded px-3 py-2 box-border"
              disabled={saving}
            />
            <input
              type="number"
              min={0}
              max={100}
              value={newSkillLevel}
              onChange={e => setNewSkillLevel(Number(e.target.value))}
              className="w-20 border rounded px-2 py-2 text-center box-border"
              disabled={saving}
            />
            <button
              onClick={addSkill}
              disabled={saving || !newSkillName.trim()}
              className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Добавить
            </button>
          </div>
        </>
      )}
    </div>
  )
}
