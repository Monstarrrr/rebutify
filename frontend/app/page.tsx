'use client'
import Link from 'next/link'
import { Button, Form, List, PostCard, Search } from '@/components'
import type { Post } from '@/types'
import { FormEvent, useEffect, useState } from 'react'
import { createPost, getPosts } from '@/api/posts'
// eslint-disable-next-line no-restricted-imports
import styles from './page.module.scss'
import { formDataToObj } from '@/helpers'

// const BtnLink = styled(Link)`
//   background-color: #3d6aff;
//   border: none;
//   color: #fff;
//   font-size: 1.1rem;
//   padding: 12px 20px;
//   border-radius: 99px;
//   cursor: pointer;
//   text-decoration: none;
// `

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false)
  const [apiErrors, setApiErrors] = useState(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [isFormActive, setIsFormActive] = useState<boolean>(false)

  const [allPosts, setAllPosts] = useState<Post[]>([])

  // Fetch onLoad
  useEffect(() => {
    const fetchArguments = async () => {
      try {
        console.log(`getting all posts`)
        const response = await getPosts('argument')
        setAllPosts(response)
      } catch (error: any) {
        console.error('# Error fetching posts: ', error)
      }
    }
    fetchArguments()
  }, [])

  const handleToggleForm = () => {
    setIsFormActive(!isFormActive)
  }

  const handleSubmitArgument = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setApiErrors(null)
    const formData = formDataToObj(event)

    try {
      const res = await createPost({ ...formData }, 'argument')
      setLoading(false)
      setSuccess('Post created successfully!')
      setAllPosts((prev) => [res.data, ...prev])
    } catch (error: any) {
      const { response } = error
      setLoading(false)
      setApiErrors(response)
    }
  }

  return (
    <>
      <div className={styles.outerContainer}>
        <div className={styles.innerContainer}>
          <div className={styles.topContainer}>
            <h2 className={styles.title}>Which argument are you looking for ?</h2>
            <Search
              placeholder='e.g. "Plants feel pain tho"'
              className={styles.search}
            />
            <div className={styles.formContainer}>
              {isFormActive ? (
                <Form
                  id='new-argument'
                  inputsErrors={apiErrors}
                  inputsFields={[
                    {
                      id: 'title',
                      label: 'Title',
                      placeholder: 'e.g. "Plants are alive too!"',
                      required: true,
                      value: '',
                    },
                    {
                      id: 'body',
                      label: 'Argument',
                      placeholder: `e.g. "If vegans don't eat meat, why do they eat plants? They are living beings too!"`,
                      type: 'textarea',
                      value: '',
                      required: true,
                      inputClassName: styles.argumentTextArea,
                    },
                  ]}
                  onSubmit={handleSubmitArgument}
                  loading={loading}
                  success={success}
                  setSuccess={setSuccess}
                  floating
                >
                  <Button
                    label={'Submit argument'}
                    loading={loading}
                    success={success}
                    size={'max'}
                  />
                </Form>
              ) : (
                <p className={styles.hintText}>Can&apos;t find it?</p>
              )}
              <Button
                label={isFormActive ? 'Cancel' : 'Create argument'}
                transparent={isFormActive}
                size='max'
                className={isFormActive ? styles.cancelBtn : styles.createBtn}
                onClick={handleToggleForm}
              />
            </div>
          </div>
          <div className={styles.resultsInfoContainer}>
            <p className={styles.resultsCounter}>
              {allPosts.length} {allPosts.length === 1 ? 'post' : 'posts'} found
            </p>
          </div>
          <List items={allPosts} Layout={PostCard} />
        </div>
      </div>
      <Link
        href='https://testingTheDeadLinkGithubHook.com'
        style={{ visibility: 'hidden' }}
      />
    </>
  )
}
