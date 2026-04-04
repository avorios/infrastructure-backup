# Family Calendar System

Centralized calendar for the board member's personal and family life.

## Structure

| File | Purpose |
|------|---------|
| `school.yaml` | School terms, holidays, parent-teacher nights, early dismissals |
| `activities.yaml` | Kids' recurring extracurriculars (sports, lessons, clubs) |
| `medical.yaml` | Medical/dental/vision appointments and checkup schedules |
| `family-events.yaml` | Birthdays, anniversaries, holidays, gatherings |
| `travel.yaml` | Upcoming trips, travel logistics, packing reminders |

## Schema (per event)

```yaml
- id: cal-NNN
  type: one-time | recurring
  category: school | activity | medical | family | travel
  title: "Event name"
  date: "YYYY-MM-DD"           # for one-time
  recurrence: "weekly Mon"      # for recurring (cron-style or plain English)
  time: "HH:MM - HH:MM"
  location: "Where"
  who: [family members involved]
  reminders: ["1d before", "morning of"]
  notes: "Additional details"
  status: confirmed | tentative | cancelled
  added: YYYY-MM-DD
```

## Workflow

1. Board provides raw events/commitments
2. EA normalizes into YAML facts
3. EA surfaces upcoming events in weekly reviews and proactive reminders
4. Board confirms or adjusts
