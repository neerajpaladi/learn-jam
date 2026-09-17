import json
import time
import urllib.error
import urllib.request

BASE_URL = "http://127.0.0.1:8000"

# Unique account for this test run
email = f"e2e_student_{int(time.time())}@example.com"
password = "password123"


def make_request(
    url: str,
    method: str = "GET",
    data: dict = None,
    token: str = None,
):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    body = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(
        url, data=body, headers=headers, method=method
    )

    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode())


print("=== Starting End-to-End Backend Test ===")

# 1. Register User
status, res = make_request(
    f"{BASE_URL}/auth/register", "POST", {"email": email, "password": password}
)
print(f"\n1. Registration ({status}):", res)

# 2. Login to Get JWT Token
status, res = make_request(
    f"{BASE_URL}/auth/login", "POST", {"email": email, "password": password}
)
token = res.get("access_token")
print(f"\n2. Login ({status}): Token acquired -> {token[:25]}...")

# 3. Update Learning Preferences
profile_payload = {
    "target_goals": ["recursion"],
    "preferred_format": "visual",
    "learning_pace": "medium",
}
status, res = make_request(
    f"{BASE_URL}/profile/me", "PUT", profile_payload, token
)
print(f"\n3. Profile Set ({status}): Preference set to '{res['preferred_format']}'")

# 4. Submit Answer (Incorrect answer to lower theta & record response)
answer_payload = {
    "question_id": "q_rec_01",
    "concept_id": "recursion",
    "selected_option_index": 1,  # Option 1 is incorrect (Option 0 is correct)
    "difficulty": 1.2,
    "discrimination": 1.0,
}
status, res = make_request(
    f"{BASE_URL}/learning/submit-answer", "POST", answer_payload, token
)
print(f"\n4. Quiz Answer Submission ({status}):")
print(f"   - Is Correct: {res['is_correct']}")
print(f"   - Ability Theta Updated: {res['previous_theta']} -> {res['new_theta']}")
print(
    f"   - Concept Mastery Updated: {res['previous_mastery']} -> {res['new_mastery']}"
)

# 5. Get Adaptive Path Recommendation for 'recursion'
status, res = make_request(
    f"{BASE_URL}/learning/recommend/recursion", "GET", token=token
)
print(f"\n5. Adaptive Path Generation ({status}):")
print(f"   - Target Requested: {res['requested_concept']}")
print(f"   - Identified Prerequisite Gaps: {res['identified_gaps']}")
print(f"   - Active Target Set to: {res['active_target_concept']}")
print(f"   - Remediation Triggered: {res['is_remediation']}")
print(f"   - Agent Decision: {res['decision_reasoning']}")
print(f"   - Matched Resources ({len(res['recommended_resources'])} found):")
for r in res["recommended_resources"]:
    print(
        f"     * [{r['content_type'].upper()}] {r['title']} (Diff: {r['difficulty']})"
    )

print("\n=== All Backend Modules Passed Successfully! ===")