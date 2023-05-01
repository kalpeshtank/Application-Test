# Build a Simple REST API in PHP With CSV file 

This example shows how to build a simple REST API in core PHP.

### Prerequisites

- [PHP](https://www.php.net/downloads.php)
- [Composer](http://getcomposer.org/)
- [Postman](https://www.postman.com/downloads/)

## Getting Started

Clone this project with the following commands:

```bash
git clone https://github.com/kalpeshtank/Application-Test.git
cd Application-Test
```

### Configure the application
Copy `.env.example` to `.env` file and enter your database deatils if you are use database for data.

```bash
cp .env.example .env
```

## Development

Install the project dependencies and start the PHP server:

```bash
composer install
```

```bash
php -S localhost:8000 -t api
```

## Your APIs

| API               |    CRUD    |                                Description |
| :---------------- | :--------: | -----------------------------------------: |
| GET /orders        |  **READ**  |        Get all the Orders from `csv` table |
| GET /order/{id}    |  **READ**  |        Get a single Order from `csv` table |
| POST /order        | **CREATE** | Create a Order and insert into `csv` table |
| PUT /order/{id}    | **UPDATE** |            Update the Order in `csv` table |
| DELETE /order/{id} | **DELETE** |            Delete a Order from `csv` table |

Test the API endpoints using [Postman](https://www.postman.com/).

## License

See [License](./LICENSE)
