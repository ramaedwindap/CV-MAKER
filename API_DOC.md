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

**URL** : `/register`

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

# Resume

**URL** : `/resumes`

**Method** : `GET`

**Auth required** : Yes

**req.headers**

```json
{
  "access_token": "string"
}
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
  "skills": "Web dev",
  "education": {
    "dateTo": "Oct 2022",
    "title": "Siliwangi University",
    "dateFrom": "Sep 2022",
    "desc": "Intelligent Systems and Informatics (S.Kom.), GPA: 3.53 ",
    "accomplishment": "Responsible for informing the results of activities organized by Informatics Student Association and publishing the achievements of students and communities in informatics.\nResponsible for informing the results of activities organized by Informatics Student Association and publishing the achievements of students and communities in informatics."
  },
  "identity": {
    "phoneNumber": "087722275005",
    "address": "Jl. Juana No. 21, Central Jakarta, Indonesia, 10310",
    "name": "Rama Edwinda",
    "description": "I am a hardworking individual who is quick to learn and willing to adapt to any challenging situation and passionate about learning new technologies, particularly in the areas of UI/UX, cloud computing, and machine learning.",
    "email": "ramaedwindap@gmail.com"
  },
  "experience": {
    "dateTo": "Oct 2022",
    "title": "Data Science IT Bootcamp Instructor",
    "dateFrom": "Sep 2022",
    "desc": "Bringing data science training with the CRoss Industry Standard Process for Data Mining (CRISP-DM) approach to Informatics students at Siliwangi University ",
    "accomplishment": "Provided materials on business understanding, including defining business, technical, and data science project objectives\nProvided materials on business understanding, including defining business, technical, and data science project objectives"
  },
  "userId": "CXEZTkMAwSAJWAXXrnhn"
}
```

## Error Response

**Code** : `500`

**Content** :

```json
{
  "message": "string"
}
```
