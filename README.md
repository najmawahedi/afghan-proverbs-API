Afghan Proverbs & Sayings API

A RESTful API to store and manage Afghan proverbs in Dari, Pashto, and English translations. Supports CRUD operations, searching, filtering by category, and retrieving random proverbs.

Features
CRUD operations for proverbs

Search proverbs by keyword

Filter proverbs by category

Get a random proverb

Endpoints
GET /proverbs – Get all proverbs

GET /proverbs/:id – Get a proverb by ID

POST /proverbs – Add a new proverb

PUT /proverbs/:id – Update a proverb by ID

DELETE /proverbs/:id – Delete a proverb by ID

GET /proverbs/random – Get a random proverb

GET /proverbs?category={category} – Filter by category

GET /proverbs/search?keyword={keyword} – Search by keyword

Tech Stack
Node.js with Express

Data Storage: JSON file

Installation

Clone the repository
git clone https://github.com/your-username/afghan-proverbs-api.git

Install dependencies by
npm install

then
Start the server
npm start
