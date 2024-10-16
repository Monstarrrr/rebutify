import * as type from '@/types'

const Post: React.FC<{ item: type.Post }> = ({ item }) => {
  const { title, body, upvotes, downvotes } = item
  return (
    <div>
      {title && (
        <div>
          <h1>{title}</h1>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div>
          <button>+</button>
          {upvotes - downvotes}
          <button>-</button>
        </div>
        <div>
          <p>{body}</p>
        </div>
      </div>
    </div>
  )
}

export default Post
