from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    app_name: str = Field(default="DevfolioAPI", env="APP_NAME")
    env: str = Field(default="development", env="ENV")
    port: int = Field(default=8000, env="PORT")

    # GitHub API
    github_username: str = Field(..., env="GITHUB_USERNAME")
    github_token: str | None = Field(default=None, env="GITHUB_TOKEN")

    # Database
    database_url: str = Field(default="sqlite:///./projects.db", env="DATABASE_URL")

    # Refresh interval in hours
    refresh_interval_hours: int = Field(default=24, env="REFRESH_INTERVAL_HOURS")

    # JWT Settings
    secret_key: str = Field(..., env="SECRET_KEY")
    algorithm: str = Field(default="HS256", env="ALGORITHM")
    access_token_expire_minutes: int = Field(default=1440, env="ACCESS_TOKEN_EXPIRE_MINUTES")

    # Telegram
    telegram_bot_token: str = Field(..., env="TELEGRAM_BOT_TOKEN")
    telegram_chat_id: int = Field(..., env="TELEGRAM_CHAT_ID")
    recaptcha_secret_key: str = Field(..., env="RECAPTCHA_SECRET_KEY")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
