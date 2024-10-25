import { vote } from '@/api/vote'
import * as type from '@/types'

const Post: React.FC<{ item: type.Post }> = ({ item }) => {
  const { title, body, upvotes, downvotes, id } = item

  const handleVote = (direction: 'up' | 'down') => () => {
    if (direction === 'up') {
      vote('argument', id, 'up')
    }
  }

  return (
    <div>
      {title && (
        <div>
          <h1>{title}</h1>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div>
          <button onClick={handleVote('up')}>+</button>
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
