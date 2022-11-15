# REST API Example

This example shows how to implement a **REST API** using [hapi](https://hapi.dev/) and [Prisma Client](https://www.prisma.io/docs/concepts/components/prisma-client). The example uses an SQLite database file with some initial dummy data which you can find at [`./prisma/dev.db`](./prisma/dev.db).

## Getting started

### 1. Download example and install dependencies

Clone this repository:

```
git clone git@github.com:prisma/prisma-examples.git --depth=1
```

Install npm dependencies:

```
cd rest-hapi
npm install
```

### 2. Create the database

Run the following command to create your SQLite database file. This also creates the `User` and `Post` tables that are defined in [`prisma/schema.prisma`](./prisma/schema.prisma):

```
npx prisma migrate dev --name bookshelf
```

When `npx prisma migrate dev` is executed against a newly created database.


### 3. Start the REST API server

```
npm run dev
```

The server is now running on `http://localhost:3000`. You can now run the API requests, e.g. [`http://localhost:3000/feed`](http://localhost:3000/feed).

## Using the REST API

You can access the REST API of the server using the following endpoints:

### `GET`

- `/book/:id`: Fetch a single book by its `id`
- `/feed?searchString={searchString}&take={take}&skip={skip}&orderBy={orderBy}`: Fetch all _published_ books
  - Query Parameters
    - `searchString` (optional): This filters books by `title` or `content`
    - `take` (optional): This specifies how many objects should be returned in the list
    - `skip` (optional): This specifies how many of the returned objects in the list should be skipped
    - `orderBy` (optional): The sort order for books in either ascending or descending order. The value can either `asc` or `desc`
- `/user/:id/drafts`: Fetch user's drafts by their `id`
- `/users`: Fetch all users
### `POST`

- `/book`: Create a new book
  - Body:
    - `title: String` (required): The title of the book
    - `content: String` (optional): The content of the book
    - `authorEmail: String` (required): The email of the user that creates the book
- `/signup`: Create a new user
  - Body:
    - `email: String` (required): The email address of the user
    - `name: String` (optional): The name of the user
    - `bookData: PostCreateInput[]` (optional): The books of the user

### `PUT`

- `/publish/:id`: Toggle the publish value of a post by its `id`
- `/post/:id/views`: Increases the `viewCount` of a `Post` by one `id`

### `DELETE`

- `/book/:id`: Delete a book by its `id`


## Switch to another database (e.g. PostgreSQL, MySQL, SQL Server, MongoDB)

If you want to try this example with another database than SQLite, you can adjust the the database connection in [`prisma/schema.prisma`](./prisma/schema.prisma) by reconfiguring the `datasource` block. 

Learn more about the different connection configurations in the [docs](https://www.prisma.io/docs/reference/database-reference/connection-urls).

### PostgreSQL

For PostgreSQL, the connection URL has the following structure:

```prisma
datasource db {
  provider = "postgresql"
  url      = "postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA"
}
```

Here is an example connection string with a local PostgreSQL database:

```prisma
datasource db {
  provider = "postgresql"
  url      = "postgresql://janedoe:mypassword@localhost:5432/bookapi?schema=public"
}
```

### MySQL

For MySQL, the connection URL has the following structure:

```prisma
datasource db {
  provider = "mysql"
  url      = "mysql://USER:PASSWORD@HOST:PORT/DATABASE"
}
```

Here is an example connection string with a local MySQL database:

```prisma
datasource db {
  provider = "mysql"
  url      = "mysql://janedoe:mypassword@localhost:3306/notesapi"
}
```