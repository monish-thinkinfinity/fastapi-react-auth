import logging

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from jose import JWTError
from motor.motor_asyncio import AsyncIOMotorDatabase
from pymongo.errors import DuplicateKeyError
from bson import ObjectId

from app.core.config import get_settings
from app.core.dependencies import get_current_user
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.db.database import get_database
from app.models.schemas import (
    MessageResponse,
    RefreshRequest,
    SignInRequest,
    SignUpRequest,
    TokenResponse,
    UserResponse,
    ResetPasswordRequest,
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

settings = get_settings()
router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/signup",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
)
async def signup(
    body: SignUpRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> TokenResponse:
    
    now = datetime.now(timezone.utc)

    user_doc = {
        "full_name": body.full_name,
        "email": body.email.lower(),
        "hashed_password": hash_password(body.password),
        "is_active": True,
        "created_at": now,
        "updated_at": now,
    }

    try:
        result = await db["users"].insert_one(user_doc)
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    user_id = str(result.inserted_id)
    created_user = await db["users"].find_one({"_id": result.inserted_id})

    logger.info(f"New user registered: {body.email}")

    return TokenResponse(
        access_token=create_access_token(user_id),
        refresh_token=create_refresh_token(user_id),
        expires_in=settings.access_token_expire_minutes * 60,
        user=UserResponse.from_mongo(created_user),
    )


@router.post(
    "/signin",
    response_model=TokenResponse,
    summary="Sign in with email & password",
)
async def signin(
    body: SignInRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> TokenResponse:

    user = await db["users"].find_one({"email": body.email.lower()})

    invalid_credentials = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid email or password.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if user is None:
        logger.warning(
            f"Failed login attempt: {body.email}"
        )
        raise invalid_credentials

    if not verify_password(body.password, user["hashed_password"]):
        logger.warning(
            f"Failed login attempt: {body.email}"
        )
        raise invalid_credentials

    if not user.get("is_active", True):
        logger.warning(
            f"Failed login attempt: {body.email}"
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated.",
        )

    user_id = str(user["_id"])

    logger.info(
        f"User signed in: {body.email}"
    )

    return TokenResponse(
        access_token=create_access_token(user_id),
        refresh_token=create_refresh_token(user_id),
        expires_in=settings.access_token_expire_minutes * 60,
        user=UserResponse.from_mongo(user),
    )


@router.post(
    "/refresh",
    response_model=TokenResponse,
    summary="Issue a new access token from a refresh token",
)
async def refresh(
    body: RefreshRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> TokenResponse:

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired refresh token.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = decode_token(body.refresh_token)
        user_id: str | None = payload.get("sub")
        token_type: str | None = payload.get("type")

        if user_id is None or token_type != "refresh":
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    try:
        user = await db["users"].find_one({"_id": ObjectId(user_id)})
    except Exception:
        raise credentials_exception

    if user is None or not user.get("is_active", True):
        raise credentials_exception

    return TokenResponse(
        access_token=create_access_token(user_id),
        refresh_token=create_refresh_token(user_id),
        expires_in=settings.access_token_expire_minutes * 60,
    )


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get the currently authenticated user's profile",
)
async def me(current_user: dict = Depends(get_current_user)) -> UserResponse:

    return UserResponse.from_mongo(current_user)


@router.post(
    "/signout",
    response_model=MessageResponse,
    summary="Sign out (client-side token invalidation)",
)
async def signout(
    current_user: dict = Depends(get_current_user),
) -> MessageResponse:

    return MessageResponse(
        message="Successfully signed out. Please discard your tokens."
    )




@router.post(
    "/reset-password",
    response_model=MessageResponse,
    summary="Reset user password",
)
async def reset_password(
    body: ResetPasswordRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    user = await db["users"].find_one(
        {"email": body.email.lower()}
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    await db["users"].update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "hashed_password": hash_password(
                    body.new_password
                ),
                "updated_at": datetime.now(timezone.utc),
            }
        },
    )

    logger.info(
        f"Password reset successful: {body.email}"
    )

    return MessageResponse(
        message="Password reset successful"
    )