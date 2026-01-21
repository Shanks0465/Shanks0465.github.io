'use client'

import { useState } from 'react'
import profile from '../config/profile.json'
import styles from './Contact.module.css'

export default function Contact({ id }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // For static site, open email client with pre-filled data
    const subject = encodeURIComponent(`Portfolio Contact from ${formData.name}`)
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  return (
    <section id={id} className={styles.contact}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.arrow}>{'>'}</span> Contact
          </h2>
          <p className={styles.sectionSubtitle}>// let's connect</p>
        </div>

        <div className={styles.content}>
          <div className={styles.info}>
            <div className={styles.terminalWindow}>
              <div className={styles.terminalHeader}>
                <div className={styles.terminalButtons}>
                  <span className={styles.btnRed}></span>
                  <span className={styles.btnYellow}></span>
                  <span className={styles.btnGreen}></span>
                </div>
                <span className={styles.terminalTitle}>contact.sh</span>
              </div>
              <div className={styles.terminalBody}>
                <p className={styles.terminalLine}>
                  <span className={styles.prompt}>$</span> echo $EMAIL
                </p>
                <p className={styles.terminalOutput}>{profile.email}</p>

                <p className={styles.terminalLine}>
                  <span className={styles.prompt}>$</span> echo $LOCATION
                </p>
                <p className={styles.terminalOutput}>{profile.location}</p>

                <p className={styles.terminalLine}>
                  <span className={styles.prompt}>$</span> cat status.txt
                </p>
                <p className={styles.terminalOutput}>
                  <span className={styles.available}>Available for opportunities</span>
                </p>
              </div>
            </div>

            <div className={styles.socialLinks}>
              <p className={styles.socialLabel}>// find me on</p>
              <div className={styles.socialGrid}>
                {profile.social.github && (
                  <a href={profile.social.github} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                    <span className={styles.socialIcon}>
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                    </span>
                    GitHub
                  </a>
                )}
                {profile.social.linkedin && (
                  <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                    <span className={styles.socialIcon}>
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </span>
                    LinkedIn
                  </a>
                )}
                {profile.social.twitter && (
                  <a href={profile.social.twitter} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                    <span className={styles.socialIcon}>
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </span>
                    Twitter
                  </a>
                )}
                <a href={`mailto:${profile.email}`} className={styles.socialLink}>
                  <span className={styles.socialIcon}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  Email
                </a>
              </div>
            </div>
          </div>

          <div className={styles.formWrapper}>
            <div className={styles.terminalPrompt}>
              <span className={styles.prompt}>$</span>
              <span className={styles.command}>./send-message.sh</span>
            </div>

            {submitted ? (
              <div className={styles.success}>
                <p className={styles.successText}>
                  <span className={styles.successIcon}>{'>'}</span>
                  Message prepared! Check your email client.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>
                    <span className={styles.labelPrefix}>const</span> name =
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder='"Your Name"'
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>
                    <span className={styles.labelPrefix}>const</span> email =
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder='"your@email.com"'
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.label}>
                    <span className={styles.labelPrefix}>const</span> message =
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className={styles.textarea}
                    placeholder='`Your message here...`'
                  />
                </div>

                <button type="submit" className={styles.submitBtn}>
                  <span className={styles.btnIcon}>{'>'}</span>
                  send_message()
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
