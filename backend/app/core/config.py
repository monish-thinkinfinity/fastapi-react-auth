from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    database_url: str = "mongodb://localhost:27017"
    database_name: str = "saascore"
    secret_key: str = "change-this-to-a-long-random-secret-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    app_name: str = "SaaS Core"
    debug: bool = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()
