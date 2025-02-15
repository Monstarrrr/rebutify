'use client'
import { useAppDispatch } from '@/store/hooks'
import { showPopup } from '@/store/slices/popup'
import { useEffect } from 'react'
// eslint-disable-next-line no-restricted-imports
import styles from './layout.module.scss'

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(
      showPopup({
        content: (
          <>
            <h1>IMPORTANT</h1>
            <p>
              This website is a prototype, if you register an account, you must
              understand the following:
            </p>
            <ul>
              <li>
                I understand that the website may break partially or completely
                without notice.
              </li>
              <li>
                I understand that I may receive unwanted emails from the website
                due to occasional errors on our end.
              </li>
              <li>
                I understand that the website has very few features and isn&apos;t
                representative of the final project.
              </li>
            </ul>
            <p>
              If you find any issues, please share them with us on{' '}
              <a className={styles.link} href='https://discord.gg/NpUB93jsJy'>
                Discord
              </a>{' '}
              or email{' '}
              <a className={styles.link} href='mailto:contact@rebutify.org'>
                contact@rebutify.org
              </a>
              . <br />
              <br />
              Thank you {`🤍`},<br />- The Rebutify Team
            </p>
          </>
        ),
      }),
    )
  }, [dispatch])

  return <>{children}</>
}
