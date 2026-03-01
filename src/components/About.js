import styles from './About.module.css'

export default function About({ id, profile }) {
  return (
    <section id={id} className={styles.about}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.arrow}>{'>'}</span> About
          </h2>
          <p className={styles.sectionSubtitle}>// who am i</p>
        </div>

        <div className={styles.content}>
          <div className={styles.codeBlock}>
            <div className={styles.codeHeader}>
              <span className={styles.fileName}>about.js</span>
            </div>
            <div className={styles.codeBody}>
              <pre className={styles.code}>
                <span className={styles.lineNumber}>1</span>
                <span className={styles.keyword}>const</span>{' '}
                <span className={styles.variable}>developer</span>{' '}
                <span className={styles.operator}>=</span> {'{'}
                {'\n'}
                <span className={styles.lineNumber}>2</span>
                {'  '}<span className={styles.property}>name</span>:{' '}
                <span className={styles.string}>"{profile.name}"</span>,
                {'\n'}
                <span className={styles.lineNumber}>3</span>
                {'  '}<span className={styles.property}>title</span>:{' '}
                <span className={styles.string}>"{profile.title}"</span>,
                {'\n'}
                <span className={styles.lineNumber}>4</span>
                {'  '}<span className={styles.property}>location</span>:{' '}
                <span className={styles.string}>"{profile.location}"</span>,
                {'\n'}
                <span className={styles.lineNumber}>5</span>
                {'  '}<span className={styles.property}>email</span>:{' '}
                <span className={styles.string}>"{profile.email}"</span>,
                {'\n'}
                <span className={styles.lineNumber}>6</span>
                {'  '}<span className={styles.property}>available</span>:{' '}
                <span className={styles.boolean}>true</span>,
                {'\n'}
                <span className={styles.lineNumber}>7</span>
                {'}'};
              </pre>
            </div>
          </div>

          <div className={styles.bio}>
            <div className={styles.terminalPrompt}>
              <span className={styles.promptSymbol}>$</span>
              <span className={styles.promptCommand}>cat bio.txt</span>
            </div>
            <p className={styles.bioText}>{profile.bio}</p>

            <div className={styles.terminalPrompt}>
              <span className={styles.promptSymbol}>$</span>
              <span className={styles.promptCommand}>cat interests.txt</span>
            </div>
            <ul className={styles.interests}>
              <li>Building scalable web applications</li>
              <li>Open source contributions</li>
              <li>Learning new technologies</li>
              <li>Problem solving & algorithms</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
