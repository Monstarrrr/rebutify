from core.typesense.utils.get_client import get_client


# Sync individual post
def sync_individual_post(self, sender, instance, created, **kwargs):
    from core.models import Post

    client = get_client()

    print(f"⏳ Syncing *single* post {instance.id} with Typesense...")
    if created or instance.updated:
        post = Post.objects.get(id=instance.id)
        document = {
            "id": str(post.id),  # Document ID must be a string
            "type": post.type,
            "title": post.title,
            "body": post.body,
            "ownerUserId": post.ownerUserId,
            "created": int(
                post.created.timestamp()
            ),  # Convert datetime to string format
            "updated": int(post.updated.timestamp()) if post.updated else None,
            "upvotes": getattr(post, "upvotes", 0),
            "downvotes": getattr(post, "downvotes", 0),
        }
        # Index the document into Typesense
        try:
            client.collections["posts"].documents.upsert(document)
            print(f"✅ Indexed post {post.id} successfully!")
        except Exception as e:
            print(f"❌ Error indexing post {post.id}: {e}")


# Sync all posts
def sync_all_posts_with_typesense(self, sender, **kwargs):
    from core.models import Post

    print("⏳ Syncing *all* posts with Typesense...")

    posts = Post.objects.all()

    print(f"ℹ️ Found {posts.count()} posts to index.")
    successCount = 0
    totalCount = len(posts)
    for post in posts:
        sync_individual_post(self, sender, instance=post, created=False, **kwargs)
        successCount += 1
        print(f"✅ Indexed post {post.id} with Typesense.")

    print(f"✅ Synced {successCount}/{totalCount} posts with Typesense.")
