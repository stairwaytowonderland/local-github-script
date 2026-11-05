import os
import sys
import time
from datetime import datetime


def format_error_message(message: str) -> str:
    return f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\t[error]\t{message}"


def exit_with_error(message: str) -> None:
    print(format_error_message(message), file=sys.stderr)
    sys.exit(1)


# Ensure dependencies are installed or instruct the user
try:
    import jwt  # Requires: pip install PyJWT cryptography
except ImportError:

    exit_with_error(
        "Missing required library. Please run: pip install PyJWT cryptography"
    )


def generate_github_jwt() -> str | None:
    # 1. Fetch values from environment variables
    app_id = os.environ.get("APP_ID")
    private_key_path = os.environ.get("APP_PRIVATE_KEY_PATH")

    # 2. Validate environment variables are present
    if not app_id:
        exit_with_error("APP_ID environment variable is not set.")

    if not private_key_path:
        exit_with_error("APP_PRIVATE_KEY_PATH environment variable is not set.")

    # 3. Read the private key certificate file
    try:
        with open(private_key_path, "r") as f:
            private_key = f.read()
    except FileNotFoundError:
        exit_with_error(f"Private key file not found at path: {private_key_path}")
    except Exception as e:
        exit_with_error(f"Error reading private key file: {e}")

    # 4. Construct the JWT payload (GitHub requires iat, exp, and iss)
    now = int(time.time())
    payload = {
        "iat": now - 60,  # Issued 1 minute ago to account for system clock drift
        "exp": now + (9 * 60),  # Expires in 9 minutes (GitHub max is 10 minutes)
        "iss": app_id,  # GitHub App ID
    }

    # 5. Sign the payload using RS256 algorithm
    try:
        encoded_jwt = jwt.encode(payload, private_key, algorithm="RS256")
        return encoded_jwt
    except Exception as e:
        exit_with_error(
            f"Error encoding JWT (ensure certificate is a valid RS256 private key): {e}"
        )


if __name__ == "__main__":
    jwt_token = generate_github_jwt()
    print(jwt_token)
