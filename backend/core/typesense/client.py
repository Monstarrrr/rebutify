import os

import typesense

# Set up the Typesense client
client = typesense.Client(
    {
        "nodes": [
            {
                "host": os.getenv(
                    "TYPESENSE_HOST", ""
                ),  # Docker container will expose this to localhost
                "port": os.getenv("TYPESENSE_PORT", ""),  # Typesense default port
                "protocol": os.getenv("TYPESENSE_PROTOCOL", ""),
            }
        ],
        "api_key": os.getenv("TYPESENSE_SECRET_KEY", ""),
        "connection_timeout_seconds": 2,
    }
)

print("TYPESENSE_HOST:", os.getenv("TYPESENSE_HOST"))
print("TYPESENSE_PORT:", os.getenv("TYPESENSE_PORT"))
print("TYPESENSE_PROTOCOL:", os.getenv("TYPESENSE_PROTOCOL"))
print(
    "TYPESENSE_SECRET_KEY:", os.getenv("TYPESENSE_SECRET_KEY", "")[0:5] + "..."
)  # Only print first 5 chars of key


# Example function to test connection
def check_connection():
    try:
        response = client.health.retrieve()
        print("Typesense is running:", response)
    except Exception as e:
        print("Error connecting to Typesense:", e)


collection_schema = {
    "name": "posts",
    "fields": [
        {"name": "id", "type": "string"},
        {"name": "type", "type": "string", "facet": True},
        {"name": "isPrivate", "type": "bool", "facet": True},
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
def create_collection():
    try:
        client.collections["posts"].retrieve()
    except typesense.exceptions.ObjectNotFound:
        try:
            client.collections.create(collection_schema)
            print("Collection 'posts' created successfully!")
        except Exception as e:
            print(f"Error creating collection: {e}")


# Does not execute on import, only when we explicitly call it.
if __name__ == "__main__":
    check_connection()
    create_collection()
