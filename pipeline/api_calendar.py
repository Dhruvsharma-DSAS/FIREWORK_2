from fastapi import APIRouter, HTTPException

from app.services.calendar_service import load_calendar

router = APIRouter(prefix="/api/calendar", tags=["calendar"])


@router.get("/{region_id}")
def get_calendar(region_id: str, mode: str = "harmonised", source_class: str = "all"):
    if mode not in ["raw", "harmonised"]:
        raise HTTPException(status_code=400, detail="mode must be raw or harmonised")
    result = load_calendar(region_id, mode, source_class)
    if result is None:
        raise HTTPException(status_code=404, detail="region not found")
    return {
        "data": result["cells"],
        "meta": {
            "data_source": result["data_source"],
            "region_id": region_id,
            "mode": mode,
            "unit": "VIIRS-equivalent cell-days",
            "years": result["years"],
            "validation": result["validation"],
            "flags": result["flags"],
        },
    }
