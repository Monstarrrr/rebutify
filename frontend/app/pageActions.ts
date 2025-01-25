import { revalidateTag } from 'next/cache'

export async function revalidatePosts() {
  revalidateTag('posts')
}
