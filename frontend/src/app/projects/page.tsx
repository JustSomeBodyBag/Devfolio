'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Projects.css'  // подключаем стили

interface Project {
  id: number
  name: string
  description: string
  screenshot_url: string | null
  tags: string[]
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filter, setFilter] = useState('Все')
  const [modalImage, setModalImage] = useState<string | null>(null)

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/public/projects/`
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`Ошибка запроса: ${res.status}`)
        return res.json()
      })
      .then(data => setProjects(data))
      .catch(err => console.error('Ошибка загрузки проектов:', err))
  }, [])

  const allTags = ['Все', ...new Set(projects.flatMap(p => p.tags || []))]

  const filtered = filter === 'Все' ? projects : projects.filter(p => p.tags.includes(filter))

  return (
    <>
      <main className="projects-main">
        <h1 className="projects-title">Проекты</h1>

        <div className="projects-filters">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className={`projects-filter-btn ${filter === tag ? 'active' : ''}`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="projects-grid">
          {filtered.map(proj => (
            <div key={proj.id} className="project-card">
              {proj.screenshot_url ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/${proj.screenshot_url}`}
                  alt={proj.name}
                  className="project-image"
                  onClick={() => setModalImage(`${process.env.NEXT_PUBLIC_API_URL}/${proj.screenshot_url}`)}
                />
              ) : (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/default-thumbnail.png`}
                  alt="default thumbnail"
                  className="project-image"
                  onClick={() => setModalImage(`${process.env.NEXT_PUBLIC_API_URL}/uploads/default-thumbnail.png`)}
                />
              )}

              <h3 className="project-name">{proj.name}</h3>
              <p className="project-desc">{proj.description}</p>
              <div className="project-tags">
                {proj.tags?.map(tag => (
                  <span key={tag} className="project-tag">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <AnimatePresence>
        {modalImage && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalImage(null)}
            className="modal-overlay"
          >
            <motion.img
              key="modal-img"
              src={modalImage}
              alt="Full screenshot"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="modal-image"
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
