## API DOCS

# Login

Used to collect a Token for a registered User.

**URL** : `/login`

**Method** : `POST`

**Auth required** : NO

**Data constraints**

```json
{
  "email": "string",
  "password": "string"
}
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJhbWFAZ21haWwuY29tIiwiY3JlYXRlZEF0Ijp7Il9zZWNvbmRzIjoxNjkzMjkwMTU1LCJfbmFub3NlY29uZHMiOjQxMzAwMDAwMH0sInVwZGF0ZWRBdCI6eyJfc2Vjb25kcyI6MTY5MzI5MDE1NSwiX25hbm9zZWNvbmRzIjo0MTMwMDAwMDB9LCJpZCI6IkNYRVpUa01Bd1NBSldBWFhybmhuIiwiaWF0IjoxNjkzNDU4MjE0fQ.dZwHeYTrFND78go7EhAhWO979GzsKIIWXNE74B5ub0c",
  "email": "rama@gmail.com"
}
```

## Error Response

**Condition** : If 'username' and 'password' combination is wrong.

**Code** : `400 BAD REQUEST`

**Content** :

```json
{
  "non_field_errors": ["Unable to login with provided credentials."]
}
```
