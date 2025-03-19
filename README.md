
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/b604e012-dd6c-4bcb-88f4-ed2a04e5aa88

## Google Calendar Integration

To use Google Calendar integration, you need to configure your Google Client ID:

Either:
1. Create a `.env.local` file with your Google Client ID:
```
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

2. Or directly edit the `src/utils/googleApiUtils.ts` file and replace the empty string with your actual client ID.

Without a Google Client ID, the application will run in demo mode with mock calendar data.

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/b604e012-dd6c-4bcb-88f4-ed2a04e5aa88) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Using Docker

You can also run this application using Docker:

### Build and run with Docker directly

```sh
# Build the Docker image
docker build -t timesync-app .

# Run the container
docker run -p 8080:80 timesync-app
```

### Using Docker Compose

```sh
# Build and start the application
docker-compose up -d

# Stop the application
docker-compose down
```

Visit `http://localhost:8080` to view the application.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/b604e012-dd6c-4bcb-88f4-ed2a04e5aa88) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
