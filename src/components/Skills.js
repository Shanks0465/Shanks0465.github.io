"use client";

import { useState } from "react";
import skillsData from "../config/skills.json";
import styles from "./Skills.module.css";

export default function Skills({ id }) {
  const [activeCategory, setActiveCategory] = useState(
    skillsData.categories[0].id,
  );

  const activeSkills =
    skillsData.categories.find((cat) => cat.id === activeCategory)?.skills ||
    [];

  return (
    <section id={id} className={styles.skills}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.arrow}>{">"}</span>{" "}
            {skillsData.sectionTitle}
          </h2>
          <p className={styles.sectionSubtitle}>{skillsData.sectionSubtitle}</p>
        </div>

        <div className={styles.content}>
          <div className={styles.categories}>
            <div className={styles.terminalPrompt}>
              <span className={styles.promptSymbol}>$</span>
              <span className={styles.promptCommand}>ls skills/</span>
            </div>
            <div className={styles.categoryList}>
              {skillsData.categories.map((category, index) => (
                <button
                  key={category.id}
                  className={`${styles.categoryBtn} ${activeCategory === category.id ? styles.active : ""}`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <span className={styles.categoryIndex}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.categoryName}>{category.name}/</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.skillsDisplay}>
            <div className={styles.terminalWindow}>
              <div className={styles.terminalHeader}>
                <div className={styles.terminalButtons}>
                  <span className={styles.btnRed}></span>
                  <span className={styles.btnYellow}></span>
                  <span className={styles.btnGreen}></span>
                </div>
                <span className={styles.terminalTitle}>
                  skills/
                  {skillsData.categories
                    .find((c) => c.id === activeCategory)
                    ?.name.toLowerCase()}
                </span>
              </div>
              <div className={styles.terminalBody}>
                <div className={styles.skillsGrid}>
                  {activeSkills.map((skill) => (
                    <div key={skill.name} className={styles.skillBadge}>
                      <span
                        className={styles.skillIcon}
                        style={{ color: skill.color }}
                      >
                        ●
                      </span>
                      <span className={styles.skillName}>{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
