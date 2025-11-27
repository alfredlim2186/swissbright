import styles from './FlavourPageBackground.module.css'

export default function FlavourPageBackground() {
  return (
    <div className={styles.pageBackground}>
      {/* Decorative gold accent lines */}
      <div className={styles.accentLine1}></div>
      <div className={styles.accentLine2}></div>
      <div className={styles.accentLine3}></div>
      <div className={styles.accentLine4}></div>
      
      {/* Subtle gold circles */}
      <div className={styles.goldCircle1}></div>
      <div className={styles.goldCircle2}></div>
      <div className={styles.goldCircle3}></div>
      <div className={styles.goldCircle4}></div>
      
      {/* Gold corner accents */}
      <div className={styles.cornerAccent1}></div>
      <div className={styles.cornerAccent2}></div>
      <div className={styles.cornerAccent3}></div>
      
      {/* Floating dots */}
      <div className={styles.floatingDot1}></div>
      <div className={styles.floatingDot2}></div>
      <div className={styles.floatingDot3}></div>
    </div>
  )
}

