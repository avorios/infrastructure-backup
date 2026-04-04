# Relationship CRM

Personal relationship tracker for the board member's inner circle.

## Structure

Each person gets a YAML file: `<first-last>.yaml`

### Schema

```yaml
name: "Full Name"
relationship: family | friend | professional | mentor | other
category: inner-circle | close | acquaintance
birthday: "YYYY-MM-DD"
anniversary: "YYYY-MM-DD"  # if applicable
contact:
  phone: ""
  email: ""
  preferred_method: text | call | email | in-person
address: ""
notes:
  interests: []
  conversation_topics: []
  dietary_preferences: ""
  important_context: ""
gifts:
  preferences: []
  history:
    - date: "YYYY-MM-DD"
      occasion: ""
      gift: ""
      reaction: ""  # loved | liked | neutral | returned
touchpoints:
  last_contact: "YYYY-MM-DD"
  frequency_goal: weekly | biweekly | monthly | quarterly
  next_reminder: "YYYY-MM-DD"
  history:
    - date: "YYYY-MM-DD"
      type: call | text | dinner | event | gift
      notes: ""
kids: []  # names and ages if relevant
```

## Usage

- **Adding people**: Create a new YAML file following the schema
- **Tracking touchpoints**: Append to `touchpoints.history`
- **Gift planning**: Check `gifts.preferences` and `gifts.history`
- **Reminders**: Use `touchpoints.next_reminder` and `birthday` for proactive nudges
