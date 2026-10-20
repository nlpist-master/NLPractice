# NLPractice

NLPractice is an interactive training environment for practicing NLP (Natural Language Processing) coaching skills through conversation with an AI-powered simulated client.

The project allows a learner to choose a client, conduct a live conversation, and receive professional feedback on question quality, listening, techniques, and areas for improvement.

## Live Demo

The project is already deployed and running live at:

https://nlpractice.vercel.app/

## Key Features

- Client and scenario selection for practice
- Live chat with an AI client
- Session timer and interaction flow
- Automatic analysis at the end of the session
- Detailed feedback on:
  - Open and closed questions
  - Identified techniques
  - Strengths
  - Improvement areas
  - Session summary

## Technologies

- HTML
- JavaScript
- React (loaded via CDN)
- Tailwind CSS (loaded via CDN)
- Babel Standalone
- Gemini API (Google Generative AI)

## Project Structure

```text
NLPractice/
├── api/
│   └── gemini.js        # API route that communicates with Gemini
├── index.html           # Main user interface
├── README.md            # Project documentation
└── .gitignore           # If present in your environment
```

## How to Run the Project

### 1) Get a Gemini API key

Create an account or access your Google AI Studio / Google Cloud project and generate a Gemini API key.

```bash
GEMINI_API_KEY=your_api_key_here
```

### 2) Run locally

This project is based on a static frontend plus a serverless API. The simplest way to run it is with Vercel:

```bash
npm install -g vercel
vercel
```

Then configure the `GEMINI_API_KEY` environment variable in the Vercel dashboard or via a local `.env.local` file when using a compatible development setup.

### 3) Open the application

Once the project is running, open the generated Vercel URL or your local server address to start practicing.

## Usage Flow

1. Choose a client for practice.
2. Start a conversation with the simulated client.
3. Focus on active listening, good questions, and clear phrasing.
4. End the session by clicking "End & Feedback".
5. Review the AI-generated analysis and recommendations.

## Notes

- The project was created specifically for practicing NLP coaching and therapeutic-style conversations with AI.
- It is suitable for teaching, simulation, and personal training.
- Because the interface is built with HTML/JavaScript without a build system, it is easy to extend and deploy.

## Useful Links

- Google AI Studio: https://aistudio.google.com/
- Vercel: https://vercel.com/

## License

If no formal project license is included, you can add one later as needed (for example, MIT).

---

If you want, I can also generate a more polished version of the README with badges, screenshots placeholders, and a cleaner GitHub-style layout.