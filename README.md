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