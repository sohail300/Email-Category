# Email Classifier

## Overview
Ai-Emailio is a web application that allows users to log in using Google OAuth, fetch their emails from Gmail, and classify them into different categories using Gemini API.

## Demo
https://github.com/sohail300/Email-Category/assets/144511967/5d8bed55-f5e0-4569-83be-8fbc13c8e0cb

*It is using Gemini FREE API, so the model can hallucinate answers.*

## Clone the repository
```bash
git clone https://github.com/sohail300/Email-Category
cd Email-Category
```

## Install the dependancies
```bash
npm install
```

## Give access to read emails
```bash
cd src/lib
```
If your token.json is not empty, then empty it.

### Run
```bash
node auth.mjs
```

## Running the NextJS server
Go to root directory

### Run
```bash
npm run dev
```
