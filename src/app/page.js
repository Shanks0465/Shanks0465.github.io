'use client'

import { useState, useEffect } from 'react'
import Hero from '../components/Hero'
import About from '../components/About'
import Skills from '../components/Skills'
import Projects from '../components/Projects'
import Papers from '../components/Papers'
import Experience from '../components/Experience'
import Education from '../components/Education'
import Contact from '../components/Contact'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import sectionsConfig from '../config/sections.json'
import { fetchAllData } from '../lib/firebaseData'

export default function Home() {
  const { sections } = sectionsConfig
  const enabledSections = sections
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order)

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAllData()
      .then(setData)
      .catch((err) => {
        console.error('Failed to load data from Firebase:', err)
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <main
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          color: '#00ff41',
          fontFamily: 'monospace',
          fontSize: '1.2rem',
        }}
      >
        <span>{'>'} Loading portfolio data...</span>
      </main>
    )
  }

  if (error || !data) {
    return (
      <main
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          color: '#ff4444',
          fontFamily: 'monospace',
          fontSize: '1.2rem',
        }}
      >
        <span>{'>'} Error: failed to load portfolio data.</span>
      </main>
    )
  }

  const sectionComponents = {
    Hero,
    About,
    Skills,
    Projects,
    Papers,
    Experience,
    Education,
    Contact,
  }

  const sectionProps = {
    Hero: {
      profile: data.profile,
      skills: data.skills,
      experience: data.experience,
      projects: data.projects,
      education: data.education,
      papers: data.papers,
    },
    About: { profile: data.profile },
    Skills: { skillsData: data.skills },
    Projects: { projectsData: data.projects },
    Papers: { papersData: data.papers },
    Experience: { experienceData: data.experience },
    Education: { educationData: data.education },
    Contact: { profile: data.profile },
  }

  return (
    <main>
      <Navigation sections={enabledSections} profile={data.profile} />

      {enabledSections.map((section) => {
        const Component = sectionComponents[section.component]
        if (!Component) return null
        return (
          <Component
            key={section.id}
            id={section.id}
            {...(sectionProps[section.component] || {})}
          />
        )
      })}

      <Footer />
    </main>
  )
}
