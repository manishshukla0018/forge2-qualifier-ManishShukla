# Live API Smoke Test

- Date: 2026-06-21 (Asia/Calcutta)
- API: `https://forge2-qualifier-manishshukla.onrender.com/api`
- Health response: HTTP 200
- Frontend response: HTTP 200

The verification created a temporary board and card, edited the card, assigned an existing member and tag, set a past due date, moved the card to another list, read the board back, and deleted the temporary board in a `finally` cleanup.

```text
BOARD_CREATED=2
CARD_EDITED=True
CARD_MOVED=True
MEMBER_ASSIGNMENT_TESTED=True
TAG_ASSIGNMENT_TESTED=True
OVERDUE_FLAG=True
BOARD_CLEANED_UP=2
```
