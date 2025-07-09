from PIL import Image
import asyncio
import os

async def process_image(filepath: str) -> str:
    loop = asyncio.get_event_loop()
    base, ext = os.path.splitext(filepath)
    preview_path = base + "_preview" + ext

    def sync_process():
        with Image.open(filepath) as img:
            width, height = img.size
            min_dim = min(width, height)
            left = (width - min_dim) / 2
            top = (height - min_dim) / 2
            right = (width + min_dim) / 2
            bottom = (height + min_dim) / 2
            img_cropped = img.crop((left, top, right, bottom))
            img_preview = img_cropped.resize((200, 200))
            img_preview.save(preview_path)

    await loop.run_in_executor(None, sync_process)
    return preview_path
