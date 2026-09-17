from datetime import datetime, timezone, timedelta
from src.db.models import StudentProfileTable

def update_student_streak(profile: StudentProfileTable) -> StudentProfileTable:
    today = datetime.now(timezone.utc).date()
    
    if not profile.last_active_date:
        profile.current_streak = 1
        profile.longest_streak = max(profile.longest_streak, 1)
        profile.last_active_date = today.isoformat()
        return profile

    last_date = datetime.fromisoformat(profile.last_active_date).date()

    if last_date == today:
        return profile
    elif last_date == today - timedelta(days=1):
        profile.current_streak += 1
        profile.longest_streak = max(profile.longest_streak, profile.current_streak)
    else:
        profile.current_streak = 1

    profile.last_active_date = today.isoformat()
    return profile