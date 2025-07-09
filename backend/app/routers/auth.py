from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import timedelta

from app import crud, schemas
from app.deps import get_current_user, get_db
from app.auth import create_access_token
from app.models import User  # если используешь PydanticUser, поменяй

router = APIRouter()

@router.post("/login", response_model=schemas.Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    user = await crud.get_user_by_username(db, form_data.username)
    if not user or not crud.verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    access_token_expires = timedelta(minutes=60 * 24)

    # 👇 Включаем роль в токен
    access_token = create_access_token(
        data={
            "sub": user.username,
            "role": user.role,  # Важно: добавили роль
        },
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.post("/change-credentials")
async def change_credentials(
    body: schemas.ChangeCredentialsRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Перезагружаем пользователя из базы
    user = await crud.get_user_by_id(db, current_user.id)

    if not crud.verify_password(body.oldPassword, user.password_hash):
        raise HTTPException(status_code=400, detail="Старый пароль неверный")

    if body.newUsername:
        existing_user = await crud.get_user_by_username(db, body.newUsername)
        if existing_user and existing_user.id != user.id:
            raise HTTPException(status_code=400, detail="Пользователь с таким именем уже существует")

    updated_user = await crud.update_user(db, user, body.newUsername, body.newPassword)

    return {"message": "Данные успешно обновлены"}
