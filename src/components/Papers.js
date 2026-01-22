'use client'

import { useState } from 'react'
import papersData from '../config/papers.json'
import styles from './Papers.module.css'

export default function Papers({ id }) {
  const [filter, setFilter] = useState('all')

  const filteredPapers = filter === 'all'
    ? papersData.papers
    : filter === 'featured'
      ? papersData.papers.filter(p => p.featured)
      : papersData.papers.filter(p => p.year === filter)

  const years = [...new Set(papersData.papers.map(p => p.year))].sort((a, b) => b - a)

  return (
    <section id={id} className={styles.papers}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.arrow}>{'>'}</span> {papersData.sectionTitle}
          </h2>
          <p className={styles.sectionSubtitle}>{papersData.sectionSubtitle}</p>
        </div>

        <div className={styles.filters}>
          <span className={styles.filterLabel}>$ filter --by</span>
          <button
            className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            all
          </button>
          <button
            className={`${styles.filterBtn} ${filter === 'featured' ? styles.active : ''}`}
            onClick={() => setFilter('featured')}
          >
            featured
          </button>
          {years.map(year => (
            <button
              key={year}
              className={`${styles.filterBtn} ${filter === year ? styles.active : ''}`}
              onClick={() => setFilter(year)}
            >
              {year}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {filteredPapers.map((paper) => (
            <article key={paper.id} className={styles.paperCard}>
              <div className={styles.cardPin}></div>
              <div className={styles.cardTape}></div>

              <div className={styles.terminalHeader}>
                <span className={styles.terminalDot}></span>
                <span className={styles.terminalDot}></span>
                <span className={styles.terminalDot}></span>
                <span className={styles.terminalTitle}>paper.md</span>
              </div>

              <div className={styles.cardContent}>
                <h3 className={styles.paperTitle}>{paper.title}</h3>

                <div className={styles.authors}>
                  <span className={styles.label}>$ authors:</span>
                  <span className={styles.authorList}>{paper.authors.join(', ')}</span>
                </div>

                <div className={styles.venue}>
                  <span className={styles.label}>$ venue:</span>
                  <span className={styles.venueText}>{paper.venue}</span>
                </div>

                <p className={styles.abstract}>{paper.abstract}</p>

                <div className={styles.tags}>
                  {paper.tags.map(tag => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>

                <div className={styles.links}>
                  {paper.arxiv && (
                    <a href={paper.arxiv} target="_blank" rel="noopener noreferrer" className={styles.link}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M4.5 2A2.5 2.5 0 0 0 2 4.5v15A2.5 2.5 0 0 0 4.5 22h15a2.5 2.5 0 0 0 2.5-2.5v-15A2.5 2.5 0 0 0 19.5 2h-15zm.75 3h13.5a.75.75 0 0 1 0 1.5H5.25a.75.75 0 0 1 0-1.5zm0 3h13.5a.75.75 0 0 1 0 1.5H5.25a.75.75 0 0 1 0-1.5zm0 3h9.5a.75.75 0 0 1 0 1.5h-9.5a.75.75 0 0 1 0-1.5zm0 3h13.5a.75.75 0 0 1 0 1.5H5.25a.75.75 0 0 1 0-1.5zm0 3h7a.75.75 0 0 1 0 1.5h-7a.75.75 0 0 1 0-1.5z"/>
                      </svg>
                      arXiv
                    </a>
                  )}
                  {paper.pdf && (
                    <a href={paper.pdf} target="_blank" rel="noopener noreferrer" className={styles.link}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                      </svg>
                      PDF
                    </a>
                  )}
                  {paper.code && (
                    <a href={paper.code} target="_blank" rel="noopener noreferrer" className={styles.link}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                      Code
                    </a>
                  )}
                </div>
              </div>

              <div className={styles.cardYear}>{paper.year}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
