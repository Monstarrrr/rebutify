import os

import typesense


def get_client():
    try:
        return typesense.Client(
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
                "connection_timeout_seconds": 10,
                "num_retries": 3,
                "retry_interval_seconds": 1,
            }
        )
    except Exception as e:
        print(f"❌ Error connecting to Typesense: {e}")
        raise
