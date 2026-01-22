import experienceData from "../config/experience.json";
import styles from "./Experience.module.css";

export default function Experience({ id }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return "Present";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  // Sort experiences by startDate in descending order (most recent first)
  const sortedExperiences = [...experienceData.experiences].sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);
    return dateB - dateA;
  });

  return (
    <section id={id} className={styles.experience}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.arrow}>{">"}</span>{" "}
            {experienceData.sectionTitle}
          </h2>
          <p className={styles.sectionSubtitle}>
            {experienceData.sectionSubtitle}
          </p>
        </div>

        <div className={styles.terminalPrompt}>
          <span className={styles.promptSymbol}>$</span>
          <span className={styles.promptCommand}>
            git log --oneline --career
          </span>
        </div>

        <div className={styles.timeline}>
          {sortedExperiences.map((exp, index) => (
            <div
              key={exp.id}
              className={`${styles.timelineItem} ${exp.current ? styles.current : ""}`}
            >
              <div className={styles.timelineMarker}>
                <span className={styles.markerDot}></span>
                {index < sortedExperiences.length - 1 && (
                  <span className={styles.markerLine}></span>
                )}
              </div>

              <div className={styles.timelineContent}>
                <div className={styles.timelineHeader}>
                  <div>
                    <h3 className={styles.position}>
                      {exp.position} @{" "}
                      {exp.companyPage ? (
                        <a
                          href={exp.companyPage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.companyName}
                        >
                          {exp.company}
                        </a>
                      ) : (
                        <span className={styles.companyName}>
                          {exp.company}
                        </span>
                      )}
                    </h3>
                  </div>
                  <div className={styles.meta}>
                    <span className={styles.date}>
                      {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                    </span>
                    <span className={styles.location}>{exp.location}</span>
                    {exp.current && (
                      <span className={styles.currentBadge}>current</span>
                    )}
                  </div>
                </div>

                <p className={styles.description}>{exp.description}</p>

                <ul className={styles.responsibilities}>
                  {exp.responsibilities.map((resp, i) => (
                    <li key={i}>
                      <span className={styles.bullet}>-</span>
                      {resp}
                    </li>
                  ))}
                </ul>

                <div className={styles.technologies}>
                  {exp.technologies.map((tech) => (
                    <span key={tech} className={styles.tech}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {experienceData.awards && experienceData.awards.length > 0 && (
          <>
            <div className={styles.sectionHeader} style={{ marginTop: "60px" }}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.arrow}>{">"}</span>{" "}
                {experienceData.awardsTitle}
              </h2>
              <p className={styles.sectionSubtitle}>
                {experienceData.awardsSubtitle}
              </p>
            </div>

            <div className={styles.terminalPrompt}>
              <span className={styles.promptSymbol}>$</span>
              <span className={styles.promptCommand}>
                cat achievements.log
              </span>
            </div>

            <div className={styles.awardsGrid}>
              {experienceData.awards.map((award) => (
                <div key={award.id} className={styles.awardCard}>
                  <div className={styles.awardIcon}>🏆</div>
                  <div className={styles.awardContent}>
                    <h3 className={styles.awardTitle}>{award.title}</h3>
                    <p className={styles.awardIssuer}>{award.issuer}</p>
                    <p className={styles.awardDate}>{formatDate(award.date)}</p>
                    {award.description && (
                      <p className={styles.awardDescription}>{award.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
