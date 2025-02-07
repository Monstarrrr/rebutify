import os
import requests
import typesense


def get_client():
    host = os.getenv("TYPESENSE_HOST", "")
    port = os.getenv("TYPESENSE_PORT", "")
    protocol = os.getenv("TYPESENSE_PROTOCOL", "")
    api_key = os.getenv("TYPESENSE_SECRET_KEY", "")
    
    if not host or not port or not protocol or not api_key:
        raise Exception(f"Missing config: Host: {host}, Port: {port}, Protocol: {protocol}, API Key: {api_key}")
    
    try:
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
                "connection_timeout_seconds": 60,
                "num_retries": 3,
                "retry_interval_seconds": 1,
            }
        )
        
        return client
    except Exception as e:
        print(f"❌ Error connecting to Typesense: {e}")
        raise
