import Hero from '../components/Hero'
import About from '../components/About'
import Skills from '../components/Skills'
import Projects from '../components/Projects'
import Experience from '../components/Experience'
import Education from '../components/Education'
import Contact from '../components/Contact'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

import profile from '../config/profile.json'
import sectionsConfig from '../config/sections.json'

export default function Home() {
  const { sections } = sectionsConfig

  // Sort sections by order and filter enabled ones
  const enabledSections = sections
    .filter(s => s.enabled)
    .sort((a, b) => a.order - b.order)

  const sectionComponents = {
    Hero,
    About,
    Skills,
    Projects,
    Experience,
    Education,
    Contact
  }

  return (
    <main>
      <Navigation sections={enabledSections} profile={profile} />

      {enabledSections.map(section => {
        const Component = sectionComponents[section.component]
        if (!Component) return null
        return <Component key={section.id} id={section.id} />
      })}

      <Footer />
    </main>
  )
}
