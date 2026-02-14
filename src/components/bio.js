import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"
import * as styles from "./bio.module.css"

const BioLinks = () => {
  return (
    <div className={styles.tags}>
      <a
        href="https://github.com/kdkdhoho"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.tagLink}
        aria-label="GitHub 프로필 바로가기"
      >
        <svg className={styles.tagIcon} viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 2C6.48 2 2 6.58 2 12.23c0 4.51 2.87 8.34 6.84 9.69.5.09.68-.22.68-.49 0-.24-.01-.88-.01-1.72-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.61.07-.61 1 .08 1.52 1.05 1.52 1.05.88 1.55 2.3 1.1 2.87.84.09-.66.35-1.1.63-1.36-2.22-.26-4.56-1.14-4.56-5.05 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.05A9.33 9.33 0 0 1 12 6.9c.85 0 1.7.12 2.5.35 1.9-1.33 2.74-1.05 2.74-1.05.56 1.42.21 2.47.11 2.73.64.72 1.02 1.64 1.02 2.76 0 3.92-2.34 4.79-4.58 5.04.36.32.68.95.68 1.92 0 1.39-.01 2.5-.01 2.84 0 .27.18.59.69.49A10.24 10.24 0 0 0 22 12.23C22 6.58 17.52 2 12 2z"
          />
        </svg>
      </a>
      <a href="mailto:hkim4410@gmail.com" className={styles.tagLink} aria-label="Email 보내기">
        <svg className={styles.tagIcon} viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M20 6H4c-1.1 0-2 .9-2 2v8.5A2.5 2.5 0 0 0 4.5 19h15a2.5 2.5 0 0 0 2.5-2.5V8c0-1.1-.9-2-2-2zm0 2-8 5-8-5h16zm-.5 9h-15a.5.5 0 0 1-.5-.5V9.3l7.47 4.66a1 1 0 0 0 1.06 0L20 9.3v7.2a.5.5 0 0 1-.5.5z"
          />
        </svg>
      </a>
      <a
        href="https://www.instagram.com/kdkdhoho/"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.tagLink}
        aria-label="Instagram 프로필 바로가기"
      >
        <svg className={styles.tagIcon} viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.25-3a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z"
          />
        </svg>
      </a>
    </div>
  )
}

const Bio = ({ variant = "full" }) => {
  const isCompact = variant === "compact"

  if (isCompact) {
    return (
      <section className={`${styles.bioCard} ${styles.compactBio}`}>
        <StaticImage
          className={styles.avatar}
          layout="fixed"
          formats={["auto", "webp", "avif", "jpeg"]}
          src="../images/profile_img.png"
          width={40}
          height={40}
          quality={100}
          alt="김동호 프로필 이미지"
        />

        <div className={styles.compactContent}>
          <div className={styles.compactText}>
            <p className={styles.name}>김동호</p>
            <p className={styles.compactDescription}>유기견 문제를 해결하고 싶은 개발자</p>
          </div>
          <BioLinks />
        </div>
      </section>
    )
  }

  return (
    <section className={styles.bioCard}>
      <StaticImage
        className={styles.avatar}
        layout="fixed"
        formats={["auto", "webp", "avif", "jpeg"]}
        src="../images/profile_img.png"
        width={48}
        height={48}
        quality={100}
        alt="김동호 프로필 이미지"
      />

      <div className={styles.content}>
        <p className={styles.name}>김동호</p>
        <p className={styles.summary}>유기견 문제를 해결하고 싶은 개발자입니다.</p>
        <BioLinks />
      </div>
    </section>
  )
}

export default Bio
