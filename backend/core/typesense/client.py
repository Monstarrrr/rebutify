import os

from core.typesense.utils.get_client import get_client

print("TYPESENSE_HOST:", os.getenv("TYPESENSE_HOST"))
print("TYPESENSE_PORT:", os.getenv("TYPESENSE_PORT"))
print("TYPESENSE_PROTOCOL:", os.getenv("TYPESENSE_PROTOCOL"))
print(
    "TYPESENSE_SECRET_KEY:", os.getenv("TYPESENSE_SECRET_KEY", "")[0:5] + "..."
)  # Only print first 5 chars of key


# Example function to test connection
def check_connection():
    client = get_client()
    try:
        health_url = f"{os.getenv('TYPESENSE_PROTOCOL')}://{os.getenv('TYPESENSE_HOST')}:{os.getenv('TYPESENSE_PORT')}/health"
        print(f"Trying to connect to: {health_url}")
        response = client.health.retrieve()
        print("Typesense is running:", response)
    except Exception as e:
        print("Error connecting to Typesense:", e)
        return False
    return True


posts_collection_schema = {
    "name": "posts",
    "fields": [
        {"name": "id", "type": "string"},
        {"name": "type", "type": "string", "facet": True},
        {"name": "title", "type": "string"},
        {"name": "body", "type": "string"},
        {"name": "ownerUserId", "type": "int32", "facet": True},
        {"name": "created", "type": "int64"},
        {"name": "updated", "type": "int64"},
        {"name": "upvotes", "type": "int32"},
        {"name": "downvotes", "type": "int32"},
    ],
    "default_sorting_field": "created",
}


# A function to create the collection, should be called explicitly when needed
def create_posts_collections():
    client = get_client()
    if client.collections["posts"]:
        try:
            print("⏳ Deleting collections...")
            client.collections["posts"].delete()
            print("✅ Collections deleted successfully!")
        except Exception as e:
            print(f"❌ Error deleting collection: {e}")

    try:
        print("⏳ Creating collections...")
        client.collections.create(posts_collection_schema)
        # client.collections.create(users_collection_schema)
        print("✅ Collections created successfully!")
    except Exception as e:
        print(f"❌ Error creating collection: {e}")


# Does not execute on import, only when we explicitly call it.
if __name__ == "__main__":
    check_connection()
    print(f"Connection status: {'Success' if check_connection() else 'Failed'}")
    create_posts_collections()
