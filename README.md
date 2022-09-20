# Omnios Hackathon - Summer '22

## 🥇 1st place winner!

We won the hackathon! The competition was based on making a company that used Linkedin data to function in any way, so many thanks to the teammates that also competed alongside me! Eric A., Arnau P. and Andreu P., you're awesome!

## ⚠️ DISCLAIMER

This was done in under a few hours, and is intended for educational purposes. Anything you do with this code is not my responsibility at all.

## What is this?

The main goal of this application is to retrieve recruiter and HR personnel profiles from top tier companies in specific fields (software, IT, health and pharma, automotive). This script will store a JSON file in AWS S3 with their names and profile links.

## Requirements:

- Node.js (>= 16)
- An Internet connection
- &gt;= 2 GB free RAM

## Environment file example

```shell
LINKEDIN_USER_NAMES="SEVERAL USERNAMES SEPARATED BY SPACE AND BASE64 ENCODED"
LINKEDIN_PASSWORDS="SEVERAL PASSWORDS SEPARATED BY SPACE AND BASE64 ENCODED"
LINKEDIN_COMPANY_SEARCH_PARAMETERS="THE QUERY YOU WANT TO RUN ON THE LINKEDIN SEARCHBAR"

AWS_ACCESS_KEY_ID="YOUR AWS ACCESS KEY ID"
AWS_SECRET_ACCESS_KEY="YOUR AWS SECRET ACCESS KEY"

AWS_BUCKET_NAME="YOUR S3 BUCKET FOR DATA OUTPUT"
```

The query used during the hackathon is the following:

```sql
(partner) OR (people) OR (human resources) OR (talent) OR (hr)
```

## Usage

```bash
npm i
npm start
```

The output files will be at the root folder of the bucket you specify.
