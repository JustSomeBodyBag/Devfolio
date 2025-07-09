from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, model_validator
from aiogram import Bot, Dispatcher
from aiogram.enums import ParseMode
from aiogram.exceptions import TelegramAPIError

from app.config import settings

router = APIRouter()

BOT_TOKEN = settings.telegram_bot_token
CHAT_ID = settings.telegram_chat_id

bot = Bot(token=BOT_TOKEN, parse_mode=ParseMode.HTML)
dp = Dispatcher()  # создаём диспетчер без параметров

class TelegramMessage(BaseModel):
    name: str
    message: str
    email: EmailStr | None = None
    telegram: str | None = None

    @model_validator(mode='after')
    def check_contact(cls, values):
        if not (values.email or values.telegram):
            raise ValueError("Укажите email или telegram для обратной связи")
        return values

@router.post("/send-telegram/")
async def send_telegram(msg: TelegramMessage):
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
        await bot.send_message(chat_id=CHAT_ID, text=text)
    except TelegramAPIError as e:
        raise HTTPException(status_code=500, detail=f"Ошибка отправки сообщения: {e}")

    return {"status": "ok"}
