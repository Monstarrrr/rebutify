from core.typesense import client  # Import the client that connects to Typesense
from core.typesense.client import create_collection


def sync_post_with_typesense(post_id):
    from core.models import Post

    create_collection()

    post = Post.objects.get(id=post_id)
    document = {
        "id": str(post.id),  # Document ID must be a string
        "title": post.title,
        "body": post.body,
        "type": post.type,
        "created": post.created.isoformat(),  # Convert datetime to string format
    }
    # Index the document into Typesense
    try:
        client.collections["posts"].documents.create(document)
        print(f"Indexed post {post_id} successfully!")
    except Exception as e:
        print(f"Error indexing post {post_id}: {e}")
