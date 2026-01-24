'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import papersData from '../config/papers.json'
import styles from './Papers.module.css'

export default function Papers({ id }) {
  const [filter, setFilter] = useState('all')
  const [currentIndex, setCurrentIndex] = useState(0)
  const terminalRef = useRef(null)

  const filteredPapers = filter === 'all'
    ? papersData.papers
    : filter === 'featured'
      ? papersData.papers.filter(p => p.featured)
      : papersData.papers.filter(p => p.year === filter)

  const years = [...new Set(papersData.papers.map(p => p.year))].sort((a, b) => b - a)

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
    setCurrentIndex(0)
  }

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : filteredPapers.length - 1))
  }, [filteredPapers.length])

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev < filteredPapers.length - 1 ? prev + 1 : 0))
  }, [filteredPapers.length])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        goToNext()
      }
    }

    const terminal = terminalRef.current
    if (terminal) {
      terminal.addEventListener('keydown', handleKeyDown)
      return () => terminal.removeEventListener('keydown', handleKeyDown)
    }
  }, [goToPrevious, goToNext])

  const currentPaper = filteredPapers[currentIndex]

  if (!currentPaper) {
    return (
      <section id={id} className={styles.papers}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.arrow}>{'>'}</span> {papersData.sectionTitle}
            </h2>
            <p className={styles.sectionSubtitle}>{papersData.sectionSubtitle}</p>
          </div>
          <div className={styles.terminalWindow}>
            <div className={styles.terminalHeader}>
              <span className={styles.terminalDot}></span>
              <span className={styles.terminalDot}></span>
              <span className={styles.terminalDot}></span>
              <span className={styles.terminalTitle}>papers.sh</span>
            </div>
            <div className={styles.terminalBody}>
              <p className={styles.noResults}>$ No papers found for this filter.</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

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
            onClick={() => handleFilterChange('all')}
          >
            all
          </button>
          <button
            className={`${styles.filterBtn} ${filter === 'featured' ? styles.active : ''}`}
            onClick={() => handleFilterChange('featured')}
          >
            featured
          </button>
          {years.map(year => (
            <button
              key={year}
              className={`${styles.filterBtn} ${filter === year ? styles.active : ''}`}
              onClick={() => handleFilterChange(year)}
            >
              {year}
            </button>
          ))}
        </div>

        <div
          className={styles.terminalWindow}
          ref={terminalRef}
          tabIndex={0}
          role="region"
          aria-label="Papers carousel"
        >
          <div className={styles.terminalHeader}>
            <span className={styles.terminalDot}></span>
            <span className={styles.terminalDot}></span>
            <span className={styles.terminalDot}></span>
            <span className={styles.terminalTitle}>papers.sh</span>
            <span className={styles.terminalCounter}>[{currentIndex + 1}/{filteredPapers.length}]</span>
          </div>

          <div className={styles.terminalBody}>
            <div className={styles.commandLine}>
              <span className={styles.prompt}>$</span>
              <span className={styles.command}>cat paper_{currentPaper.id}.md</span>
              <span className={styles.cursor}>_</span>
            </div>

            <div className={styles.outputSection}>
              <div className={styles.outputLine}>
                <span className={styles.outputKey}># Title:</span>
                <span className={styles.outputValue}>{currentPaper.title}</span>
              </div>

              <div className={styles.outputLine}>
                <span className={styles.outputKey}># Year:</span>
                <span className={styles.outputValue}>{currentPaper.year}</span>
              </div>

              <div className={styles.outputLine}>
                <span className={styles.outputKey}># Authors:</span>
                <span className={styles.outputValue}>{currentPaper.authors.join(', ')}</span>
              </div>

              <div className={styles.outputLine}>
                <span className={styles.outputKey}># Venue:</span>
                <span className={styles.outputValue}>{currentPaper.venue}</span>
              </div>

              <div className={styles.outputBlock}>
                <span className={styles.outputKey}># Abstract:</span>
                <p className={styles.abstract}>{currentPaper.abstract}</p>
              </div>

              <div className={styles.outputLine}>
                <span className={styles.outputKey}># Tags:</span>
                <div className={styles.tags}>
                  {currentPaper.tags.map(tag => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>

              <div className={styles.linksSection}>
                <span className={styles.outputKey}># Links:</span>
                <div className={styles.links}>
                  {currentPaper.arxiv && (
                    <a href={currentPaper.arxiv} target="_blank" rel="noopener noreferrer" className={styles.link}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M4.5 2A2.5 2.5 0 0 0 2 4.5v15A2.5 2.5 0 0 0 4.5 22h15a2.5 2.5 0 0 0 2.5-2.5v-15A2.5 2.5 0 0 0 19.5 2h-15zm.75 3h13.5a.75.75 0 0 1 0 1.5H5.25a.75.75 0 0 1 0-1.5zm0 3h13.5a.75.75 0 0 1 0 1.5H5.25a.75.75 0 0 1 0-1.5zm0 3h9.5a.75.75 0 0 1 0 1.5h-9.5a.75.75 0 0 1 0-1.5zm0 3h13.5a.75.75 0 0 1 0 1.5H5.25a.75.75 0 0 1 0-1.5zm0 3h7a.75.75 0 0 1 0 1.5h-7a.75.75 0 0 1 0-1.5z"/>
                      </svg>
                      arXiv
                    </a>
                  )}
                  {currentPaper.pdf && (
                    <a href={currentPaper.pdf} target="_blank" rel="noopener noreferrer" className={styles.link}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                      </svg>
                      PDF
                    </a>
                  )}
                  {currentPaper.code && (
                    <a href={currentPaper.code} target="_blank" rel="noopener noreferrer" className={styles.link}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                      Code
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.navigation}>
              <button
                className={styles.navButton}
                onClick={goToPrevious}
                aria-label="Previous paper"
              >
                <span className={styles.navArrow}>{'<'}</span>
                <span className={styles.navText}>prev</span>
              </button>

              <div className={styles.navIndicators}>
                {filteredPapers.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.navDot} ${index === currentIndex ? styles.navDotActive : ''}`}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Go to paper ${index + 1}`}
                  />
                ))}
              </div>

              <button
                className={styles.navButton}
                onClick={goToNext}
                aria-label="Next paper"
              >
                <span className={styles.navText}>next</span>
                <span className={styles.navArrow}>{'>'}</span>
              </button>
            </div>

            <div className={styles.helpLine}>
              <span className={styles.helpText}>Use arrow keys or click buttons to navigate | Press dot indicators to jump</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
