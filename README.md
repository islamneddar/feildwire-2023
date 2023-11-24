## Backend NestJS Proejct example README

This README provides a comprehensive guide to the backend project for the software engineering position test. It includes details about the project structure, installation, running the application, API routes


## Project Structure

The project adheres to a standard Nest.js application structure:

- `src`: Contains the source code.
- `src/app.module.ts`: The root module of the application.
- `src/external-service` : Contains the code for the external service that is used to fetch the data. (image proccessing and file storage)


## Installation

`yarn install` to install all the dependencies

`yarn migration:run` to run all the migration to have the schema of the database

`yarn build` to build the project

`yarn start` to start the project

## API Routes

### POST /auth/login

``` 
curl --location 'localhost:8080/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
"email" : "test@email.com",
"password" : "test.123"
}'`
```

### POST /auth/signup

```
curl --location 'localhost:8080/auth/signup' \
--header 'Content-Type: application/json' \
--data-raw '{
"email" : "test@email.com",
"password" : "test.123",
}'
```

### POST /project

```
curl --location 'localhost:8080/project/' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4ZDdlZGMxLWQ5NjktNDA0ZS1hMmVjLTczNjZkM2Y0ODhjZSIsImVtYWlsIjoiaXNsYW0ubmVkZGFyQGdtYWlsLmNvbSIsImlhdCI6MTY5OTEyNTkxMywiZXhwIjoxNzMwNjYxOTEzfQ.xEroa2rJtfPkZSGrKRTgTIEAYEvkXhyn1a0vPwSYhSk' \
--data '{
    "name" : "project test"
}'
```

### GET /project

```
curl --location 'localhost:8080/project' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4ZDdlZGMxLWQ5NjktNDA0ZS1hMmVjLTczNjZkM2Y0ODhjZSIsImVtYWlsIjoiaXNsYW0ubmVkZGFyQGdtYWlsLmNvbSIsImlhdCI6MTY5OTEyNTkxMywiZXhwIjoxNzMwNjYxOTEzfQ.xEroa2rJtfPkZSGrKRTgTIEAYEvkXhyn1a0vPwSYhSk'
```

### GET /project/:id

```
curl --location 'localhost:8080/project/dfd7e15e-1eeb-4e26-a334-3fd48c5060dc' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4ZDdlZGMxLWQ5NjktNDA0ZS1hMmVjLTczNjZkM2Y0ODhjZSIsImVtYWlsIjoiaXNsYW0ubmVkZGFyQGdtYWlsLmNvbSIsImlhdCI6MTY5OTEyNTkxMywiZXhwIjoxNzMwNjYxOTEzfQ.xEroa2rJtfPkZSGrKRTgTIEAYEvkXhyn1a0vPwSYhSk'
```

### PATCH /project/:id

```
curl --location --request PATCH 'localhost:8080/project/dfd7e15e-1eeb-4e26-a334-3fd48c5060dc' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4ZDdlZGMxLWQ5NjktNDA0ZS1hMmVjLTczNjZkM2Y0ODhjZSIsImVtYWlsIjoiaXNsYW0ubmVkZGFyQGdtYWlsLmNvbSIsImlhdCI6MTY5OTEyNTkxMywiZXhwIjoxNzMwNjYxOTEzfQ.xEroa2rJtfPkZSGrKRTgTIEAYEvkXhyn1a0vPwSYhSk' \
--data '{
    "name" : "project updatedd"
}'
```

### DELETE /project/:id

```
curl --location --request DELETE 'localhost:8080/project/e95e1a2b-75d9-499a-aed2-6c6e87e31f56' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4ZDdlZGMxLWQ5NjktNDA0ZS1hMmVjLTczNjZkM2Y0ODhjZSIsImVtYWlsIjoiaXNsYW0ubmVkZGFyQGdtYWlsLmNvbSIsImlhdCI6MTY5OTEyNTkxMywiZXhwIjoxNzMwNjYxOTEzfQ.xEroa2rJtfPkZSGrKRTgTIEAYEvkXhyn1a0vPwSYhSk'
```

### POST /floor-plan

```
curl --location 'localhost:8080/floor-plan' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4ZDdlZGMxLWQ5NjktNDA0ZS1hMmVjLTczNjZkM2Y0ODhjZSIsImVtYWlsIjoiaXNsYW0ubmVkZGFyQGdtYWlsLmNvbSIsImlhdCI6MTY5OTEyNTkxMywiZXhwIjoxNzMwNjYxOTEzfQ.xEroa2rJtfPkZSGrKRTgTIEAYEvkXhyn1a0vPwSYhSk' \
--form 'floorPlanImage='"IMG_9392.jpeg"' \
--form 'projectId="e95e1a2b-75d9-499a-aed2-6c6e87e31f56"'
```

### GET /floor-plan/:id

```
curl --location 'localhost:8080/floor-plan/252820ff-1181-4b9c-87a9-eeba1809daa4' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4ZDdlZGMxLWQ5NjktNDA0ZS1hMmVjLTczNjZkM2Y0ODhjZSIsImVtYWlsIjoiaXNsYW0ubmVkZGFyQGdtYWlsLmNvbSIsImlhdCI6MTY5OTEyNTkxMywiZXhwIjoxNzMwNjYxOTEzfQ.xEroa2rJtfPkZSGrKRTgTIEAYEvkXhyn1a0vPwSYhSk'
```

### GET /floor-plan/project/:id

```
curl --location 'localhost:8080/floor-plan/project/e95e1a2b-75d9-499a-aed2-6c6e87e31f56' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4ZDdlZGMxLWQ5NjktNDA0ZS1hMmVjLTczNjZkM2Y0ODhjZSIsImVtYWlsIjoiaXNsYW0ubmVkZGFyQGdtYWlsLmNvbSIsImlhdCI6MTY5OTEyNTkxMywiZXhwIjoxNzMwNjYxOTEzfQ.xEroa2rJtfPkZSGrKRTgTIEAYEvkXhyn1a0vPwSYhSk'
```

### PATCH /floor-plan/:id

```
curl --location --request PATCH 'localhost:8080/floor-plan/8d4481cf-0865-4c42-8cb0-a7fa8873fc09' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4ZDdlZGMxLWQ5NjktNDA0ZS1hMmVjLTczNjZkM2Y0ODhjZSIsImVtYWlsIjoiaXNsYW0ubmVkZGFyQGdtYWlsLmNvbSIsImlhdCI6MTY5OTEyNTkxMywiZXhwIjoxNzMwNjYxOTEzfQ.xEroa2rJtfPkZSGrKRTgTIEAYEvkXhyn1a0vPwSYhSk' \
--form 'name="test floorplan"' \
--form 'floorPlanImage=@"IMG_0123.jpeg"'
```

### DELETE /floor-plan/:id

```
curl --location --request DELETE 'localhost:8080/floor-plan/be0428ba-007c-41c2-acad-92d56a665251' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4ZDdlZGMxLWQ5NjktNDA0ZS1hMmVjLTczNjZkM2Y0ODhjZSIsImVtYWlsIjoiaXNsYW0ubmVkZGFyQGdtYWlsLmNvbSIsImlhdCI6MTY5OTEyNTkxMywiZXhwIjoxNzMwNjYxOTEzfQ.xEroa2rJtfPkZSGrKRTgTIEAYEvkXhyn1a0vPwSYhSk'
```
