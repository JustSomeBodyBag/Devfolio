from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from .. import crud, schemas
from ..database import get_db

from geoip2.database import Reader as GeoIPReader
import os

router = APIRouter(prefix="/analytics", tags=["analytics"])

# Путь к базе GeoLite2 относительно этого файла
GEOIP_DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "GeoLite2-Country.mmdb"))
geoip_reader = GeoIPReader(GEOIP_DB_PATH)

@router.post("/visit", status_code=201)
async def record_visit(
    visit: schemas.VisitCreate, request: Request, db: AsyncSession = Depends(get_db)
):
    # Получаем IP клиента
    client_ip = request.client.host

    # Определяем страну по IP через GeoIP2
    try:
        response = geoip_reader.country(client_ip)
        country = response.country.name or "Unknown"
    except Exception:
        country = "Unknown"

    # Обновляем данные визита
    visit_data = visit.dict()
    visit_data["ip"] = client_ip
    visit_data["country"] = country

    # Создаём запись визита в БД
    await crud.create_visit(db, schemas.VisitCreate(**visit_data))
    return {"message": "Visit recorded"}

@router.get("/stats", response_model=schemas.StatsResponse)
async def get_stats(db: AsyncSession = Depends(get_db)):
    stats = await crud.get_stats(db)
    return stats
