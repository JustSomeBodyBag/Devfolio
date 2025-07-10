import re
import httpx
from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel, EmailStr, model_validator
from aiogram import Bot
from aiogram.enums import ParseMode
from aiogram.exceptions import TelegramAPIError
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.config import settings

router = APIRouter()

bot = Bot(token=settings.telegram_bot_token, parse_mode=ParseMode.HTML)

limiter = Limiter(key_func=get_remote_address)

def sanitize_text(text: str) -> str:
    return re.sub(r"[<>\"'%;()&+]", "", text)

class TelegramMessage(BaseModel):
    name: str
    message: str
    email: EmailStr | None = None
    telegram: str | None = None

    @model_validator(mode='after')
    def check_contact(cls, values):
        if not (values.email or values.telegram):
            raise ValueError("Укажите email или telegram для обратной связи")
        values.name = sanitize_text(values.name)
        values.message = sanitize_text(values.message)
        if values.telegram:
            values.telegram = sanitize_text(values.telegram)
        return values

@router.post("/send-telegram/")
@limiter.limit("5/minute")
async def send_telegram(request: Request, msg: TelegramMessage):
    data = await request.json()
    token = data.get("recaptcha_token")
    if not token:
        raise HTTPException(status_code=400, detail="reCAPTCHA token is required")

    # Проверяем reCAPTCHA у Google
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://www.google.com/recaptcha/api/siteverify",
            data={"secret": settings.recaptcha_secret_key, "response": token},
        )
        result = response.json()
        if not result.get("success") or result.get("score", 0) < 0.5:
            raise HTTPException(status_code=400, detail="Не прошла проверка reCAPTCHA")

    contact_info = ""
    if msg.email:
        contact_info += f"📧 Email: {msg.email}\n"
    if msg.telegram:
        contact_info += f"💬 Telegram: {msg.telegram}\n"

    text = (
        f"📩 <b>Новое сообщение с сайта</b>:\n\n"
        f"👤 Имя: {msg.name}\n"
        f"{contact_info}"
        f"📝 Сообщение:\n{msg.message}"
    )

    try:
        await bot.send_message(chat_id=settings.telegram_chat_id, text=text)
    except TelegramAPIError as e:
        raise HTTPException(status_code=500, detail=f"Ошибка отправки сообщения: {e}")

    return {"status": "ok"}
