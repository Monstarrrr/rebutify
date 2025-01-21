import { List, PostCard, Search } from '@/components'
// eslint-disable-next-line no-restricted-imports
import styles from './page.module.scss'
import { fetchPosts } from '@/api/posts'
// import { formDataToObj } from '@/helpers'

export default async function Home() {
  // const user = useAppSelector((state) => state.user)

  // const [loading, setLoading] = useState<boolean>(false)
  // const [apiErrors, setApiErrors] = useState(null)
  // const [success, setSuccess] = useState<string | null>(null)

  // const [isFormActive, setIsFormActive] = useState<boolean>(false)

  // const [loadingArguments, setLoadingArguments] = useState<boolean>(false)
  // const [allPosts, setAllPosts] = useState<Post[]>([])

  const allArguments = await fetchPosts('argument')
  console.log(`# allArguments :`, allArguments)
  // Fetch onLoad
  // useEffect(() => {
  //   const fetchArguments = async () => {
  //     try {
  //       setLoadingArguments(true)
  //       console.log(`getting all posts`)
  //       const response = await getPosts('argument')
  //       setAllPosts(response)
  //       setLoadingArguments(false)
  //     } catch (error: any) {
  //       setLoadingArguments(false)
  //       console.error('# Error fetching posts: ', error)
  //     }
  //   }
  //   fetchArguments()
  // }, [])

  // const handleToggleForm = () => {
  //   setIsFormActive(!isFormActive)
  // }

  // const handleSubmitArgument = async (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault()
  //   setLoading(true)
  //   setApiErrors(null)
  //   // const formData = formDataToObj(event)

  //   try {
  //     // const res = await createPost({ ...formData }, 'argument')
  //     setLoading(false)
  //     setSuccess('Post created successfully!')
  //     // setAllPosts((prev) => [res.data, ...prev])
  //   } catch (error: any) {
  //     const { response } = error
  //     setLoading(false)
  //     setApiErrors(response)
  //   }
  // }

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
            {/* <div className={styles.formContainer}>
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
              {user.id ? (
                <Button
                  label={isFormActive ? 'Cancel' : 'Create argument'}
                  transparent={isFormActive}
                  size='max'
                  className={isFormActive ? styles.cancelBtn : styles.createBtn}
                  onClick={handleToggleForm}
                />
              ) : (
                <Link className={styles.loginBtn} href={'/login'}>
                  <Button
                    label={'Create argument'}
                    size='max'
                    className={styles.createBtn}
                  />
                </Link>
              )}
            </div> */}
          </div>
          <div className={styles.resultsInfoContainer}>
            <p className={styles.resultsCounter}>
              {/* {loadingArguments
                ? `Loading posts...`
                : `${allArguments.length} ${allArguments.length === 1 ? 'post' : 'posts'} found`} */}
            </p>
          </div>
          <List items={allArguments} Layout={PostCard} />
        </div>
      </div>
    </>
  )
}
