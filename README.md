# Job Automation System

A complete job automation system that scrapes job listings from Adecco.nl and automates the application process using candidate resume data.

## Features

- **Job Scraping**: Extracts job listings from Adecco.nl with details like title, location, salary, and application links
- **Resume Parsing**: Extracts candidate information from resumes in PDF, DOCX, or TXT formats
- **Job-Candidate Matching**: Matches candidates to appropriate jobs based on skills and requirements
- **Automated Application**: Fills out job application forms automatically using candidate data
- **Error Handling & Logging**: Comprehensive error handling and logging system

## Project Structure

The project follows MVC architecture:

- **Models**: Job and Candidate data models
- **Views**: Basic HTML views for API endpoints
- **Controllers**: Handle API requests and responses
- **Services**: Core business logic for scraping, parsing, matching, and applying
- **Routes**: API endpoint definitions
- **Utils**: Utility functions for logging and error handling

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with the following variables:

```
PORT=3000
TARGET_URL=https://www.adecco.nl/vacatures
LOG_LEVEL=info
```

## Usage

1. Start the server:

```bash
npm start
```

2. Access the API endpoints:

- `GET /api/jobs` - Get all scraped jobs
- `POST /api/jobs/scrape` - Force a new scrape of jobs
- `GET /api/candidates` - Get all parsed candidates
- `POST /api/candidates/parse` - Force a new parse of resumes
- `GET /api/applications/matches` - Get all job-candidate matches
- `POST /api/applications/apply` - Apply to jobs for matched candidates

## Sample Data

Sample data is provided for testing:

- Sample jobs in `data/jobs/sample-jobs.json`
- Sample resumes in `data/resumes/sample-resumes.json`

## Adding Resumes

To add candidate resumes:

1. Place PDF, DOCX, or TXT resume files in the `data/resumes` directory
2. Run the resume parser via the API endpoint or by restarting the server

## Technologies Used

- Node.js and Express for the backend
- Playwright for web scraping and form automation
- PDF-parse for resume parsing
- Winston for logging

## Headless CMS

The app also functions as a headless CMS with JSON-based persistence and API-key-protected write operations.

### Environment

Copy `.env.example` to `.env` and set values:

```
PORT=3000
TARGET_URL=https://www.adecco.nl/vacatures
LOG_LEVEL=info
API_KEY=change-me-strong-key
# Optional webhook for CRUD events
WEBHOOK_URL=
```

Include your API key via header `x-api-key: <API_KEY>` (required for POST/PUT/DELETE and imports).

### CMS Endpoints

- Jobs
  - GET `/api/jobs/items` — list stored jobs
  - GET `/api/jobs/items/:id` — get job by id
  - POST `/api/jobs/items` — create job (auth required)
  - PUT `/api/jobs/items/:id` — update job (auth required)
  - DELETE `/api/jobs/items/:id` — delete job (auth required)
  - GET `/api/jobs/export` — export all jobs
  - POST `/api/jobs/import` — bulk import/replace jobs (auth required)
  - Existing scrape: GET `/api/jobs`, POST `/api/jobs/scrape`

- Candidates
  - GET `/api/candidates/items` — list stored candidates
  - GET `/api/candidates/items/:id` — get candidate by id
  - POST `/api/candidates/items` — create candidate (auth required)
  - PUT `/api/candidates/items/:id` — update candidate (auth required)
  - DELETE `/api/candidates/items/:id` — delete candidate (auth required)
  - GET `/api/candidates/export` — export all candidates
  - POST `/api/candidates/import` — bulk import/replace candidates (auth required)
  - Existing parse: GET `/api/candidates`, POST `/api/candidates/parse`

- Applications
  - GET `/api/applications/items` — list stored applications
  - GET `/api/applications/items/:id` — get application by id
  - POST `/api/applications/items` — create application (auth required)
  - PUT `/api/applications/items/:id` — update application (auth required)
  - DELETE `/api/applications/items/:id` — delete application (auth required)
  - GET `/api/applications/export` — export all applications
  - POST `/api/applications/import` — bulk import/replace applications (auth required)
  - Matching & apply: GET `/api/applications/matches`, POST `/api/applications/apply`

### Example Requests

Create a candidate:

```bash
curl -X POST http://localhost:3000/api/candidates/items \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{
    "name": "Alex Doe",
    "email": "alex@example.com",
    "skills": ["JavaScript","React"]
  }'
```

Bulk import jobs (replace all):

```bash
curl -X POST http://localhost:3000/api/jobs/import \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '[{"title":"Job A"},{"title":"Job B"}]'
```

### Webhooks

If `WEBHOOK_URL` is set, the server sends a JSON POST payload on CRUD events:

```
{
  "event": "created|updated|deleted",
  "entity": "job|candidate|application",
  "data": { ... },
  "timestamp": "2025-01-01T00:00:00.000Z"
}