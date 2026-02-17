'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import profile from '../config/profile.json'
import experience from '../config/experience.json'
import skills from '../config/skills.json'
import education from '../config/education.json'
import projects from '../config/projects.json'
import papers from '../config/papers.json'
import styles from './Hero.module.css'

const LLM_CONFIG = {
  model: 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC',
  temperature: 0.3,        
  top_p: 0.8,              
  max_tokens: 200,         
  frequency_penalty: 1.2,  
  presence_penalty: 0.6,   
}

// Build system prompt from all config data
const buildSystemPrompt = () => {
  const skillsList = skills.categories.map(cat =>
    `${cat.name}: ${cat.skills.map(s => s.name).join(', ')}`
  ).join('\n')

  const experienceList = experience.experiences.map(exp =>
    `- ${exp.position} at ${exp.company} (${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}): ${exp.responsibilities.slice(0, 2).join(' ')}`
  ).join('\n')

  const projectsList = projects.projects.map(proj =>
    `- ${proj.name}: ${proj.description}`
  ).join('\n')

  const educationList = education.education.map(edu =>
    `- ${edu.degree} in ${edu.field} from ${edu.institution} (${edu.startDate} - ${edu.endDate}), GPA: ${edu.gpa}`
  ).join('\n')

  const papersList = papers.papers.map(paper =>
    `- "${paper.title}" at ${paper.venue} (${paper.year})`
  ).join('\n')

  const awardsList = experience.awards?.map(award =>
    `- ${award.title} from ${award.issuer} (${award.date}): ${award.description}`
  ).join('\n') || 'None listed'

  return `You are a helpful assistant embedded in ${profile.name}'s portfolio website. Your ONLY job is to answer questions using the data provided below. STRICT RULES:
- ONLY use facts from the data below. NEVER invent or assume information.
- ${profile.name} is NOT a founder, CEO, or owner. Do NOT make up job titles.
- Do NOT describe this website or its pages. Focus on the person's skills, experience, and projects.
- If the question is not answerable from the data below, say "I don't have that information."
- Keep answers short (2-3 sentences max).

DATA ABOUT ${profile.name.toUpperCase()}:

Title: ${profile.title}
Location: ${profile.location}
Email: ${profile.email}
GitHub: ${profile.social.github}
LinkedIn: ${profile.social.linkedin}

Skills:
${skillsList}

Work Experience:
${experienceList}

Projects:
${projectsList}

Education:
${educationList}

Research Papers:
${papersList}

Awards:
${awardsList}`
}

export default function Hero({ id }) {
  const [displayText, setDisplayText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [currentLine, setCurrentLine] = useState(0)
  const [introComplete, setIntroComplete] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [userInput, setUserInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [engineStatus, setEngineStatus] = useState('idle') // idle, loading, ready, error
  const [loadingProgress, setLoadingProgress] = useState('')
  const engineRef = useRef(null)
  const inputRef = useRef(null)

  const lines = [
    { type: 'command', text: 'whoami' },
    { type: 'output', text: profile.name },
    { type: 'command', text: 'cat title.txt' },
    { type: 'output', text: profile.title },
    { type: 'command', text: 'cat location.txt' },
    { type: 'output', text: profile.location }
  ]

  // Initialize WebLLM engine
  const initEngine = useCallback(async () => {
    if (engineStatus !== 'idle') return

    setEngineStatus('loading')
    setLoadingProgress('Initializing AI...')

    try {
      const { CreateMLCEngine } = await import('@mlc-ai/web-llm')

      const engine = await CreateMLCEngine(LLM_CONFIG.model, {
        initProgressCallback: (progress) => {
          setLoadingProgress(progress.text || 'Loading model...')
        }
      })

      engineRef.current = engine
      setEngineStatus('ready')
      setLoadingProgress('')
    } catch (error) {
      console.error('Failed to initialize WebLLM:', error)
      setEngineStatus('error')
      setLoadingProgress(`Error: ${error.message}`)
    }
  }, [engineStatus])

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)
    return () => clearInterval(cursorInterval)
  }, [])

  useEffect(() => {
    if (currentLine >= lines.length) {
      setIntroComplete(true)
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

  // Focus input when intro completes
  useEffect(() => {
    if (introComplete && inputRef.current) {
      inputRef.current.focus()
    }
  }, [introComplete])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!userInput.trim() || isLoading) return

    const question = userInput.trim()
    setUserInput('')

    if (question === '/clear') {
      setChatMessages([])
      return
    }

    setChatMessages(prev => [...prev, { type: 'user', text: question }])

    // Initialize engine on first question if not ready
    if (engineStatus === 'idle') {
      await initEngine()
    }

    if (engineStatus === 'error') {
      setChatMessages(prev => [...prev, {
        type: 'system',
        text: 'AI is unavailable. Please check if your browser supports WebGPU.'
      }])
      return
    }

    // Wait for engine to be ready
    if (!engineRef.current) {
      setChatMessages(prev => [...prev, {
        type: 'system',
        text: 'Loading AI model, please wait...'
      }])
      return
    }

    setIsLoading(true)

    try {
      const response = await engineRef.current.chat.completions.create({
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          ...chatMessages.filter(m => m.type !== 'system').map(m => ({
            role: m.type === 'user' ? 'user' : 'assistant',
            content: m.text
          })),
          { role: 'user', content: question }
        ],
        max_tokens: LLM_CONFIG.max_tokens,
        temperature: LLM_CONFIG.temperature,
        top_p: LLM_CONFIG.top_p,
        frequency_penalty: LLM_CONFIG.frequency_penalty,
        presence_penalty: LLM_CONFIG.presence_penalty,
      })

      const answer = response.choices[0]?.message?.content || 'Sorry, I could not generate a response.'
      setChatMessages(prev => [...prev, { type: 'assistant', text: answer }])
    } catch (error) {
      console.error('Chat error:', error)
      setChatMessages(prev => [...prev, {
        type: 'system',
        text: 'Failed to get response. Please try again.'
      }])
    } finally {
      setIsLoading(false)
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

    // Render chat messages after intro
    if (introComplete) {
      // Show hint if no messages yet
      if (chatMessages.length === 0 && engineStatus !== 'loading') {
        rendered.push(
          <div key="hint" className={styles.hintLine}>
            <span className={styles.hintText}>
              Ask me anything about {profile.name}&apos;s profile, skills, or experience. (Beware of Hallucinations. Do not believe everything it says xD)
            </span>
          </div>
        )
      }

      // Show loading progress
      if (engineStatus === 'loading' && loadingProgress) {
        rendered.push(
          <div key="loading-status" className={styles.line}>
            <span className={styles.loadingText}>{loadingProgress}</span>
          </div>
        )
      }

      // Render chat history
      chatMessages.forEach((msg, idx) => {
        if (msg.type === 'user') {
          rendered.push(
            <div key={`chat-${idx}`} className={styles.line}>
              <span className={styles.promptUser}>{profile.username}</span>
              <span className={styles.promptAt}>@</span>
              <span className={styles.promptHost}>portfolio</span>
              <span className={styles.promptColon}>:</span>
              <span className={styles.promptPath}>~</span>
              <span className={styles.promptSymbol}>$ </span>
              <span className={styles.command}>{msg.text}</span>
            </div>
          )
        } else if (msg.type === 'assistant') {
          rendered.push(
            <div key={`chat-${idx}`} className={styles.line}>
              <span className={styles.output}>{msg.text}</span>
            </div>
          )
        } else {
          rendered.push(
            <div key={`chat-${idx}`} className={styles.line}>
              <span className={styles.loadingText}>{msg.text}</span>
            </div>
          )
        }
      })

      // Show loading indicator
      if (isLoading) {
        rendered.push(
          <div key="loading" className={styles.line}>
            <span className={styles.loadingText}>Thinking...</span>
          </div>
        )
      }

      // Show input line
      rendered.push(
        <form key="input-form" onSubmit={handleSubmit} className={styles.inputLine}>
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
            placeholder="Type your question..."
            disabled={isLoading || engineStatus === 'loading'}
          />
          {showCursor && !userInput && <span className={styles.cursor}>_</span>}
        </form>
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
          <div className={styles.terminalBody}>
            {renderLines()}
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
