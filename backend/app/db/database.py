from motor.motor_asyncio import (
    AsyncIOMotorClient,
    AsyncIOMotorDatabase,
)

from app.core.config import get_settings

import logging

settings = get_settings()

logger = logging.getLogger(__name__)

_client: AsyncIOMotorClient | None = None


async def connect_db() -> None:
    global _client

    _client = AsyncIOMotorClient(settings.database_url)

    await _client.admin.command("ping")

    logger.info("Connected to MongoDB")


async def close_db() -> None:
    global _client

    if _client:
        _client.close()

        logger.info("MongoDB connection closed")


def get_client() -> AsyncIOMotorClient:
    if _client is None:
        raise RuntimeError(
            "Database not initialized. Call connect_db() first."
        )

    return _client


async def get_database() -> AsyncIOMotorDatabase:
    return get_client()[settings.database_name]


async def create_indexes(db: AsyncIOMotorDatabase) -> None:
    from pymongo import ASCENDING

    await db["users"].create_index(
        [("email", ASCENDING)],
        unique=True,
        name="email_unique",
    )

    logger.info("MongoDB indexes created")