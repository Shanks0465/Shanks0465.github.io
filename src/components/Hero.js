'use client'

import { useState, useEffect, useRef } from 'react'
import profile from '../config/profile.json'
import skills from '../config/skills.json'
import education from '../config/education.json'
import experience from '../config/experience.json'
import projects from '../config/projects.json'
import styles from './Hero.module.css'

export default function Hero({ id }) {
  const [displayText, setDisplayText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [currentLine, setCurrentLine] = useState(0)
  const [isTypingDone, setIsTypingDone] = useState(false)

  // LLM states
  const [userInput, setUserInput] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [loadProgress, setLoadProgress] = useState('')
  const [modelLoaded, setModelLoaded] = useState(false)
  const engineRef = useRef(null)
  const inputRef = useRef(null)
  const terminalBodyRef = useRef(null)

  const lines = [
    { type: 'command', text: 'whoami' },
    { type: 'output', text: profile.name },
    { type: 'command', text: 'cat title.txt' },
    { type: 'output', text: profile.title },
    { type: 'command', text: 'cat location.txt' },
    { type: 'output', text: profile.location }
  ]

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)
    return () => clearInterval(cursorInterval)
  }, [])

  useEffect(() => {
    if (currentLine >= lines.length) {
      setIsTypingDone(true)
      return
    }

    const line = lines[currentLine]
    let charIndex = 0
    const speed = line.type === 'command' ? 50 : 20

    const typeInterval = setInterval(() => {
      if (charIndex <= line.text.length) {
        setDisplayText(line.text.slice(0, charIndex))
        charIndex++
      } else {
        clearInterval(typeInterval)
        setTimeout(() => {
          setCurrentLine(prev => prev + 1)
          setDisplayText('')
        }, line.type === 'command' ? 500 : 300)
      }
    }, speed)

    return () => clearInterval(typeInterval)
  }, [currentLine])

  // Focus input when typing animation is done
  useEffect(() => {
    if (isTypingDone && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isTypingDone])

  // Auto-scroll terminal to bottom
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight
    }
  }, [chatHistory, loadProgress])

  const initializeModel = async () => {
    if (engineRef.current || isModelLoading) return

    setIsModelLoading(true)
    setLoadProgress('Initializing WebLLM...')

    try {
      const { CreateMLCEngine } = await import('@mlc-ai/web-llm')

      const engine = await CreateMLCEngine('SmolLM2-1.7B-Instruct-q4f16_1-MLC', {
        initProgressCallback: (progress) => {
          setLoadProgress(progress.text)
        }
      })

      engineRef.current = engine
      setModelLoaded(true)
      setLoadProgress('')
    } catch (error) {
      console.error('Failed to load model:', error)
      setLoadProgress(`Error: ${error.message}`)
    } finally {
      setIsModelLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!userInput.trim() || isGenerating) return

    const command = userInput.trim()
    setUserInput('')

    // Add user command to history
    setChatHistory(prev => [...prev, { type: 'command', text: command }])

    // Handle special commands
    if (command.toLowerCase() === 'clear') {
      setChatHistory([])
      return
    }

    if (command.toLowerCase() === 'help') {
      setChatHistory(prev => [...prev, {
        type: 'output',
        text: 'Commands: clear, help, or chat with the AI assistant'
      }])
      return
    }

    // Initialize model if not loaded
    if (!modelLoaded && !isModelLoading) {
      await initializeModel()
    }

    if (!engineRef.current) {
      setChatHistory(prev => [...prev, {
        type: 'output',
        text: 'Model failed to load. Please refresh and try again.'
      }])
      return
    }

    setIsGenerating(true)

    try {
      // Build context from config files
      const skillsSummary = skills.categories.map(cat =>
        `${cat.name}: ${cat.skills.map(s => `${s.name} (${s.years} years)`).join(', ')}`
      ).join('; ')

      const projectsSummary = projects.projects.map(p =>
        `${p.name} (${p.year}): ${p.description} [Tech: ${p.technologies.join(', ')}]${p.live ? ` - Live at: ${p.live}` : ''}`
      ).join('\n')

      const educationSummary = education.education.map(e =>
        `${e.degree} in ${e.field} from ${e.institution} (${e.startDate} to ${e.endDate}), GPA: ${e.gpa}. Activities: ${e.activities.join(', ')}`
      ).join('\n')

      const certsSummary = education.certifications.map(c =>
        `${c.name} from ${c.issuer} (${c.date})`
      ).join(', ')

      const experienceSummary = experience.experiences.map(e =>
        `${e.position} at ${e.company} (${e.startDate} to ${e.current ? 'Present' : e.endDate}): ${e.description} Technologies: ${e.technologies.join(', ')}`
      ).join('\n')

      const systemPrompt = `You are a helpful AI assistant embedded in ${profile.name}'s portfolio terminal. Keep responses brief and conversational (2-3 sentences max). Answer questions about ${profile.name} using the following information:

PROFILE:
- Name: ${profile.name}
- Title: ${profile.title}
- Location: ${profile.location}
- Email: ${profile.email}
- GitHub: ${profile.social.github}
- LinkedIn: ${profile.social.linkedin}

SKILLS:
${skillsSummary}

PROJECTS:
${projectsSummary}

EDUCATION:
${educationSummary}
Certifications: ${certsSummary}

EXPERIENCE:
${experienceSummary}

Use this information to answer visitor questions about ${profile.name}'s background, skills, projects, education, and experience. Be helpful and accurate.`

      const response = await engineRef.current.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: command }
        ],
        max_tokens: 150,
        temperature: 0.3,
        top_p: 0.9,
        stream: true
      })

      let fullResponse = ''
      setChatHistory(prev => [...prev, { type: 'output', text: '' }])

      for await (const chunk of response) {
        const content = chunk.choices[0]?.delta?.content || ''
        fullResponse += content
        setChatHistory(prev => {
          const newHistory = [...prev]
          newHistory[newHistory.length - 1] = { type: 'output', text: fullResponse }
          return newHistory
        })
      }
    } catch (error) {
      console.error('Generation error:', error)
      setChatHistory(prev => [...prev, {
        type: 'output',
        text: `Error: ${error.message}`
      }])
    } finally {
      setIsGenerating(false)
      inputRef.current?.focus()
    }
  }

  const renderLines = () => {
    const rendered = []

    for (let i = 0; i < currentLine; i++) {
      const line = lines[i]
      rendered.push(
        <div key={i} className={styles.line}>
          {line.type === 'command' ? (
            <>
              <span className={styles.promptUser}>{profile.username}</span>
              <span className={styles.promptAt}>@</span>
              <span className={styles.promptHost}>portfolio</span>
              <span className={styles.promptColon}>:</span>
              <span className={styles.promptPath}>~</span>
              <span className={styles.promptSymbol}>$ </span>
              <span className={styles.command}>{line.text}</span>
            </>
          ) : (
            <span className={styles.output}>{line.text}</span>
          )}
        </div>
      )
    }

    if (currentLine < lines.length) {
      const line = lines[currentLine]
      rendered.push(
        <div key="current" className={styles.line}>
          {line.type === 'command' ? (
            <>
              <span className={styles.promptUser}>{profile.username}</span>
              <span className={styles.promptAt}>@</span>
              <span className={styles.promptHost}>portfolio</span>
              <span className={styles.promptColon}>:</span>
              <span className={styles.promptPath}>~</span>
              <span className={styles.promptSymbol}>$ </span>
              <span className={styles.command}>{displayText}</span>
              {showCursor && <span className={styles.cursor}>_</span>}
            </>
          ) : (
            <>
              <span className={styles.output}>{displayText}</span>
              {showCursor && <span className={styles.cursor}>_</span>}
            </>
          )}
        </div>
      )
    }

    return rendered
  }

  return (
    <section id={id} className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.terminalWindow}>
          <div className={styles.terminalHeader}>
            <div className={styles.terminalButtons}>
              <span className={styles.btnRed}></span>
              <span className={styles.btnYellow}></span>
              <span className={styles.btnGreen}></span>
            </div>
            <span className={styles.terminalTitle}>
              {profile.username}@portfolio: ~
            </span>
          </div>
          <div className={styles.terminalBody} ref={terminalBodyRef}>
            {renderLines()}

            {/* Hint message after typing animation completes */}
            {isTypingDone && chatHistory.length === 0 && !loadProgress && (
              <div className={styles.hintLine}>
                <span className={styles.hintText}>
                  Tip: Ask me anything in this terminal to learn more about me via WebLLM
                </span>
              </div>
            )}

            {/* Chat history */}
            {chatHistory.map((item, index) => (
              <div key={`chat-${index}`} className={styles.line}>
                {item.type === 'command' ? (
                  <>
                    <span className={styles.promptUser}>{profile.username}</span>
                    <span className={styles.promptAt}>@</span>
                    <span className={styles.promptHost}>portfolio</span>
                    <span className={styles.promptColon}>:</span>
                    <span className={styles.promptPath}>~</span>
                    <span className={styles.promptSymbol}>$ </span>
                    <span className={styles.command}>{item.text}</span>
                  </>
                ) : (
                  <span className={styles.output}>{item.text}</span>
                )}
              </div>
            ))}

            {/* Loading progress */}
            {loadProgress && (
              <div className={styles.line}>
                <span className={styles.loadingText}>{loadProgress}</span>
              </div>
            )}

            {/* Interactive input */}
            {isTypingDone && (
              <form onSubmit={handleSubmit} className={styles.inputLine}>
                <span className={styles.promptUser}>{profile.username}</span>
                <span className={styles.promptAt}>@</span>
                <span className={styles.promptHost}>portfolio</span>
                <span className={styles.promptColon}>:</span>
                <span className={styles.promptPath}>~</span>
                <span className={styles.promptSymbol}>$ </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className={styles.terminalInput}
                  placeholder={modelLoaded ? 'Ask me anything...' : 'Type to load AI...'}
                  disabled={isGenerating}
                  autoComplete="off"
                  spellCheck="false"
                />
                {showCursor && !userInput && <span className={styles.cursor}>_</span>}
              </form>
            )}
          </div>
        </div>

        <div className={styles.cta}>
          <a href={`mailto:${profile.email}`} className={styles.btnPrimary}>
            <span className={styles.btnIcon}>{'>'}</span>
            Get In Touch
          </a>
          <a href={profile.resume} className={styles.btnSecondary} target="_blank" rel="noopener noreferrer">
            <span className={styles.btnIcon}>$</span>
            Download Resume
          </a>
        </div>

        <div className={styles.social}>
          {profile.social.github && (
            <a href={profile.social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
          )}
          {profile.social.linkedin && (
            <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          )}
          {profile.social.twitter && (
            <a href={profile.social.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
          )}
        </div>

        <div className={styles.scrollIndicator}>
          <span>scroll down</span>
          <div className={styles.scrollArrow}></div>
        </div>
      </div>
    </section>
  )
}
