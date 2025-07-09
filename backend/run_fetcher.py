# run_fetcher.py
import asyncio
from app.github_fetcher import fetch_and_save_projects

if __name__ == "__main__":
    asyncio.run(fetch_and_save_projects())
