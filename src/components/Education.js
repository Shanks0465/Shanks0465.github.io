import educationData from "../config/education.json";
import styles from "./Education.module.css";

export default function Education({ id }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section id={id} className={styles.education}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.arrow}>{">"}</span>{" "}
            {educationData.sectionTitle}
          </h2>
          <p className={styles.sectionSubtitle}>
            {educationData.sectionSubtitle}
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.degrees}>
            <div className={styles.terminalPrompt}>
              <span className={styles.promptSymbol}>$</span>
              <span className={styles.promptCommand}>cat education.log</span>
            </div>

            {educationData.education.map((edu) => (
              <div key={edu.id} className={styles.eduCard}>
                <div className={styles.eduHeader}>
                  <h3 className={styles.degree}>{edu.degree}</h3>
                  <span className={styles.field}>{edu.field}</span>
                </div>

                <div className={styles.institution}>
                  <span className={styles.institutionName}>
                    {edu.institution}
                  </span>
                  <span className={styles.eduMeta}>
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </span>
                </div>

                {edu.gpa && (
                  <p className={styles.gpa}>
                    <span className={styles.gpaLabel}>GPA:</span> {edu.gpa}
                  </p>
                )}

                {edu.honors && edu.honors.length > 0 && (
                  <div className={styles.honors}>
                    {edu.honors.map((honor, i) => (
                      <span key={i} className={styles.honor}>
                        {honor}
                      </span>
                    ))}
                  </div>
                )}

                {edu.relevantCourses && edu.relevantCourses.length > 0 && (
                  <div className={styles.courses}>
                    <span className={styles.coursesLabel}>
                      // relevant courses
                    </span>
                    <ul className={styles.courseList}>
                      {edu.relevantCourses.map((course, i) => (
                        <li key={i}>{course}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {edu.activities && edu.activities.length > 0 && (
                  <div className={styles.activities}>
                    <span className={styles.activitiesLabel}>
                      // activities & achievements
                    </span>
                    <ul className={styles.activityList}>
                      {edu.activities.map((activity, i) => (
                        <li key={i}>{activity}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* {educationData.certifications && educationData.certifications.length > 0 && (
            <div className={styles.certifications}>
              <div className={styles.terminalPrompt}>
                <span className={styles.promptSymbol}>$</span>
                <span className={styles.promptCommand}>ls certifications/</span>
              </div>

              <div className={styles.certGrid}>
                {educationData.certifications.map((cert) => (
                  <div key={cert.id} className={styles.certCard}>
                    <div className={styles.certIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="8" r="6"/>
                        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
                      </svg>
                    </div>
                    <div className={styles.certInfo}>
                      <h4 className={styles.certName}>{cert.name}</h4>
                      <p className={styles.certIssuer}>{cert.issuer}</p>
                      <p className={styles.certDate}>
                        Issued: {formatDate(cert.date)}
                        {cert.expires && ` | Expires: ${formatDate(cert.expires)}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )} */}
        </div>
      </div>
    </section>
  );
}
