---

## Y2: Cross-Feature Error Catalog

**Scope:** All error codes used across WineApp v1 features. Error codes follow the pattern `DOMAIN_CONDITION`. All error responses use the standard envelope:

```json
{
  "data": null,
  "error": {
    "code": "WINE_NOT_FOUND",
    "message": "Wine record not found",
    "fields": {}        // only present for 422 validation errors; maps field name → error message
  }
}
```

For validation errors (422), the `fields` object maps each failing field to its specific error:
```json
{
  "error": {
    "code": "WINE_VALIDATION_FAILED",
    "message": "One or more fields failed validation",
    "fields": {
      "wine_name": "wine_name is required",
      "vintage_year": "vintage_year must be between 1800 and 2028"
    }
  }
}
```

---

### Authentication Errors

| Error Code | HTTP Status | Description | Retry? |
|------------|-------------|-------------|--------|
| `AUTH_REQUIRED` | 401 | No valid session token present or token expired | Re-authenticate |
| `AUTH_FAILED` | 401 | Email/password combination is incorrect | Check credentials |
| `AUTH_MISSING_CREDENTIALS` | 422 | Login request missing email or password | Fix request |
| `AUTH_ACCOUNT_LOCKED` | 403 | Account has been locked (future: brute-force protection) | Contact support |

---

### Wine Inventory Errors (F00)

| Error Code | HTTP Status | Description | Field |
|------------|-------------|-------------|-------|
| `WINE_VALIDATION_FAILED` | 422 | One or more fields failed validation | See `fields` object |
| `WINE_NOT_FOUND` | 404 | No wine record with this ID exists for this user | — |
| `WINE_INVALID_TYPE` | 422 | wine_type value is not a recognized enum | `wine_type` |
| `WINE_INVALID_QUANTITY` | 422 | quantity_owned is negative | `quantity_owned` |
| `WINE_INVALID_VINTAGE` | 422 | vintage_year is outside allowed range (1800–current+2) | `vintage_year` |
| `WINE_INVALID_PURCHASE_DATE` | 422 | purchase_date is in the future | `purchase_date` |
| `WINE_INVALID_WINDOW` | 422 | drink_window_end is before drink_window_start | `drink_window_end` |
| `WINE_WINDOW_END_WITHOUT_START` | 422 | drink_window_end provided without drink_window_start | `drink_window_start` |
| `WINE_INVALID_WINDOW_YEAR` | 422 | Drinking window year is not a valid 4-digit integer | `drink_window_start` or `drink_window_end` |

---

### Bottle Status Errors (F03)

| Error Code | HTTP Status | Description | Field |
|------------|-------------|-------------|-------|
| `BOTTLE_NONE_REMAINING` | 422 | quantity_owned is already 0; cannot consume or gift | — |
| `BOTTLE_INVALID_DATE` | 422 | event_date is in the future | `event_date` |
| `EVENT_NOT_FOUND` | 404 | No bottle_status_events record with this ID for this user | — |

---

### Tasting Note Errors (F04)

| Error Code | HTTP Status | Description | Field |
|------------|-------------|-------------|-------|
| `NOTE_NOT_FOUND` | 404 | No tasting note with this ID exists for this user | — |
| `NOTE_INVALID_RATING` | 422 | personal_rating is outside 1–100 range | `personal_rating` |
| `NOTE_INVALID_DATE` | 422 | date_opened is in the future | `date_opened` |
| `NOTE_INVALID_BUY_AGAIN` | 422 | would_buy_again is not one of: yes, no, maybe | `would_buy_again` |
| `NOTE_FIELD_TOO_LONG` | 422 | A text field exceeds its maximum character limit | See `fields` |
| `NOTE_VALIDATION_FAILED` | 422 | Generic validation failure across multiple fields | See `fields` |

---

### Search and Filter Errors (F02)

| Error Code | HTTP Status | Description | Field |
|------------|-------------|-------------|-------|
| `FILTER_INVALID_TYPE` | 422 | A wine_type filter value is not a valid enum | `wine_type` |
| `FILTER_INVALID_VINTAGE_RANGE` | 422 | vintage_year_min > vintage_year_max | `vintage_year_min` |
| `FILTER_INVALID_PRICE_RANGE` | 422 | price_min > price_max | `price_min` |
| `FILTER_INVALID_RATING` | 422 | rating_min is outside 1–100 range | `rating_min` |
| `FILTER_INVALID_SORT` | 422 | sort parameter is not a valid enum value | `sort` |

---

### Dashboard Errors (F05)

| Error Code | HTTP Status | Description | Retry? |
|------------|-------------|-------------|--------|
| `DASHBOARD_QUERY_FAILED` | 500 | One or more dashboard queries failed | Yes — transient |

---

### Server Errors (All Features)

| Error Code | HTTP Status | Description | Retry? |
|------------|-------------|-------------|--------|
| `INTERNAL_ERROR` | 500 | Unexpected server error | Yes — transient |
| `SERVICE_UNAVAILABLE` | 503 | Server temporarily unable to handle request | Yes — after delay |
| `NOT_FOUND` | 404 | Route or resource does not exist | No |
| `METHOD_NOT_ALLOWED` | 405 | HTTP method not allowed for this endpoint | No |
| `RATE_LIMITED` | 429 | Too many requests (future: rate limiting) | Yes — after delay |

---

### Client-Side Error Handling Guidelines

**For 401 errors:** Redirect to login. Do not display raw error to user.
**For 404 errors:** Show a "not found" inline message in the relevant view. Navigate back if appropriate.
**For 422 errors:** Display field-level error messages below each failing form field. Do not clear other field values.
**For 500/503 errors:** Show a persistent banner: "Something went wrong. Please try again." Preserve any unsaved form state.
**For network errors (no response):** Show: "Could not connect. Check your internet connection and try again."

---

*Y2 — Cross-Feature Error Catalog*
