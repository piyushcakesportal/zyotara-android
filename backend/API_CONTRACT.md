# DashaVaani Prediction API Contract

The mobile app calls a private backend. The backend owns:

- Vedic astrology provider credentials
- AI-provider credentials
- Location and timezone resolution
- Input validation and abuse prevention
- Dasha, antardasha, houses and transit calculations
- Safe explanation generation
- Output validation and logging without unnecessary personal data

## Endpoint

```text
POST /v1/predictions
Content-Type: application/json
```

## Request

```json
{
  "language": "en",
  "profile": {
    "name": "Sample User",
    "dateOfBirth": "1995-05-20",
    "birthTime": "14:35",
    "birthTimePrecision": "exact",
    "birthPlace": "New Delhi"
  },
  "question": {
    "category": "career",
    "questionType": "job_change",
    "questionLabel": "Is this a favourable time to change jobs?",
    "context": "I have been in the same role for three years."
  }
}
```

Do not forward the user's name or unnecessary free-text context to the astrology calculation provider.

## Successful response

```json
{
  "id": "prediction-unique-id",
  "createdAt": "2026-07-26T12:00:00.000Z",
  "language": "en",
  "category": "career",
  "questionType": "job_change",
  "questionLabel": "Is this a favourable time to change jobs?",
  "context": "I have been in the same role for three years.",
  "birthDataPrecision": "exact",
  "source": "live",
  "sections": {
    "shortAnswer": "Two or three concise sentences.",
    "currentPhase": "Plain-language interpretation of the supplied chart factors.",
    "favourablePeriod": "A date range, not a guaranteed event date.",
    "cautionPeriod": "A caution range only when supported by the calculations.",
    "whyThisMatters": "Dasha, antardasha, relevant houses and transit reasons.",
    "practicalActions": [
      "Practical action one.",
      "Practical action two.",
      "Practical action three."
    ],
    "traditionalGuidance": "Optional low-risk guidance without expensive products.",
    "disclaimer": "Astrology offers guidance, not guaranteed outcomes."
  }
}
```

## Required validation

- Allow only `career` and `relationship`.
- Reject health, pregnancy, death, legal-case, gambling, harm and surveillance questions.
- Verify date, time and birthplace.
- Treat approximate or unknown birth time as lower precision.
- Never invent missing planetary data.
- Do not give guaranteed employment, marriage, breakup or reconciliation dates.
- Return an error instead of an incomplete or unsafe reading.

## Suggested errors

```json
{
  "error": {
    "code": "DAILY_LIMIT",
    "message": "Daily question limit reached."
  }
}
```

Use appropriate HTTP status codes such as `400`, `422`, `429` and `503`.

