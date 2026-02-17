# Project README

## AI Tools Used
This project was developed with assistance from:

- **ChatGPT (OpenAI)** – for debugging, UI logic refinement, and architectural guidance in a Next.js + React environment.
- **Claude (Anthropic)** – used for reviewing code patterns, improving prompt clarity, and suggesting alternative implementation approaches.

## Prompting Approach
Prompts were written in a task-oriented style, focusing on:

- Describing the exact bug or behavior
- Providing full code snippets for context
- Requesting targeted fixes instead of general explanations
- Iterating quickly based on runtime errors

The workflow followed a loop:

problem → minimal explanation → test → refine

This allowed rapid debugging and UI iteration while keeping control of final implementation decisions.

## Manual Changes Made
Several adjustments were applied manually after AI suggestions:

- TypeScript strict typing fixes
- Hook ordering corrections
- Image fallback behavior tuning
- Zustand store integration cleanup
- Placeholder image handling for CDN failures
- UI polish and styling adjustments
- Error handling improvements

## Deployment
- The project was deployed on **Netlify**, ensuring continuous integration and live hosting.
- Git workflow followed proper practices: feature branches, commits with meaningful messages, and merging via pull requests to maintain code stability.

The final code reflects developer judgment layered on top of AI suggestions rather than direct copy-paste output.
