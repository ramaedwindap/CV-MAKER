## API DOCS

# Login

**URL** : `/login`

**Method** : `POST`

**Auth required** : NO

**req.body**

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

**Code** : `400 | 401`

**Content** :

```json
{
  "message": "string"
}
```

# Regist

**URL** : `/resgister`

**Method** : `POST`

**Auth required** : NO

**req.body**

```json
{
  "email": "string",
  "password": "string"
}
```

## Success Response

**Code** : `201 OK`

**Content example**

```json
{
  "id": "CQmnTy7u1qfOb5kT6wxQ",
  "email": "rasdsdma@gmail.com"
}
```

## Error Response

**Code** : `400 | 401`

**Content** :

```json
{
  "message": "string"
}
```
