'use client'

import { useState, useEffect } from 'react'
import styles from './Navigation.module.css'

export default function Navigation({ sections, profile }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      // Find active section
      const sectionElements = sections.map(s => ({
        id: s.id,
        element: document.getElementById(s.id)
      })).filter(s => s.element)

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const { id, element } = sectionElements[i]
        const rect = element.getBoundingClientRect()
        if (rect.top <= 150) {
          setActiveSection(id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className={`${styles.nav} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <div className={styles.logo} onClick={() => scrollToSection('hero')}>
          <span className={styles.prompt}>~</span>
          <span className={styles.user}>{profile.username}</span>
          <span className={styles.cursor}></span>
        </div>

        <button
          className={styles.mobileToggle}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`${styles.links} ${isMobileMenuOpen ? styles.open : ''}`}>
          {sections.filter(s => s.id !== 'hero').map((section, index) => (
            <li key={section.id}>
              <button
                className={`${styles.link} ${activeSection === section.id ? styles.active : ''}`}
                onClick={() => scrollToSection(section.id)}
              >
                <span className={styles.index}>{String(index + 1).padStart(2, '0')}.</span>
                {section.component.toLowerCase()}()
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
