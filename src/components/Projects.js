'use client'

import { useState } from 'react'
import projectsData from '../config/projects.json'
import styles from './Projects.module.css'

export default function Projects({ id }) {
  const [filter, setFilter] = useState('all')

  const filteredProjects = filter === 'all'
    ? projectsData.projects
    : filter === 'featured'
      ? projectsData.projects.filter(p => p.featured)
      : projectsData.projects.filter(p => p.status === filter)

  return (
    <section id={id} className={styles.projects}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.arrow}>{'>'}</span> {projectsData.sectionTitle}
          </h2>
          <p className={styles.sectionSubtitle}>{projectsData.sectionSubtitle}</p>
        </div>

        <div className={styles.filters}>
          <span className={styles.filterLabel}>$ filter --by</span>
          {['all', 'featured', 'completed', 'in-progress'].map(f => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {filteredProjects.map((project, index) => (
            <article key={project.id} className={styles.projectCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <div className={styles.cardLinks}>
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                    </a>
                  )}
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noopener noreferrer" aria-label="Live site">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15 3 21 3 21 9"/>
                        <line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>

              <h3 className={styles.projectName}>{project.name}</h3>
              <p className={styles.projectDescription}>{project.description}</p>

              <div className={styles.projectMeta}>
                <span className={`${styles.status} ${styles[project.status.replace('-', '')]}`}>
                  {project.status}
                </span>
                <span className={styles.year}>{project.year}</span>
              </div>

              <div className={styles.technologies}>
                {project.technologies.map(tech => (
                  <span key={tech} className={styles.tech}>{tech}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
