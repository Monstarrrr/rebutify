'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
// eslint-disable-next-line no-restricted-imports
import styles from './popup.module.scss'
import { hidePopup } from '@/store/slices/popup'
import { Button } from '@/components'

const Popup = () => {
  const popup = useAppSelector((state) => state.popup)
  const dispatch = useAppDispatch()
  if (!popup.isVisible) return null

  // const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
  //   if (e.target === e.currentTarget) {
  //     dispatch(hidePopup())
  //   }
  // };
  const handleCloseClick = () => {
    dispatch(hidePopup())
  }

  return (
    <div
      className={styles.backdrop}
      // onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
      >
        <div className={styles.content}>
          {popup.content}
          <Button
            className={styles.closeButton}
            label='I understand'
            size='max'
            onClick={handleCloseClick}
          />
        </div>
      </motion.div>
    </div>
  )
}

export default Popup
