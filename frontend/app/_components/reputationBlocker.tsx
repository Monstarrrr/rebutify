// eslint-disable-next-line no-restricted-imports
import styles from './reputationBlocker.module.scss'

export default function ReputationBlocker({ action }: { action: string }) {
  return (
    <p className={styles.reputationNeeded}>
      *You need more reputation to {action}, post useful arguments to get more.
    </p>
  )
}
