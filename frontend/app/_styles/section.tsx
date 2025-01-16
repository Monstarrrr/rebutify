// eslint-disable-next-line no-restricted-imports
import styles from './section.module.scss'

type SectionStyleProps = {
  children: React.ReactNode
  className?: string
}

export default function SectionStyle({ children, className }: SectionStyleProps) {
  return (
    <div className={`sectionStyle ${styles.sectionStyle} ${className ?? ''}`}>
      {children}
    </div>
  )
}
