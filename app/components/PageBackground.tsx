import styles from './PageBackground.module.css'

export default function PageBackground() {
  return (
    <div className={styles.pageBackground}>
      {/* Decorative gold accent lines */}
      <div className={styles.accentLine1}></div>
      <div className={styles.accentLine2}></div>
      <div className={styles.accentLine3}></div>
      
      {/* Subtle gold circles */}
      <div className={styles.goldCircle1}></div>
      <div className={styles.goldCircle2}></div>
      <div className={styles.goldCircle3}></div>
      
      {/* Gold corner accents */}
      <div className={styles.cornerAccent1}></div>
      <div className={styles.cornerAccent2}></div>
    </div>
  )
}

