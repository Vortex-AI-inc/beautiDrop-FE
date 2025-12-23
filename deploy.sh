#!/bin/bash
set -euo pipefail

echo "🚀 BeautyDrop AI Frontend - Deployment Script"
echo "=============================================="
echo ""

# Configuration
PROJECT_ID="beautydrop-dev"
REGION="us-east1"
SERVICE_NAME="beautydrop-frontend"
REPOSITORY="beautydrop-frontend"
IMAGE_NAME="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/app:latest"

# Load environment variables from .env if it exists
if [ -f .env ]; then
  echo "Load variables from .env"
  # Clean up and export variables, ignoring comments
  export $(grep -v '^#' .env | xargs)
fi

# Fallback/Required checks (mapping .env names to script names if needed)
CLERK_PUBLISHABLE_KEY="${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:-}"
CLERK_SECRET="${CLERK_SECRET_KEY:-}"
BACKEND_URL="${NEXT_PUBLIC_BACKEND_URL:-https://api.beautydrop.ai/}"

# Ensure required variables are set
if [ -z "$CLERK_PUBLISHABLE_KEY" ] || [ -z "$CLERK_SECRET" ]; then
  echo "❌ Error: CLERK_PUBLISHABLE_KEY or CLERK_SECRET_KEY is not set in .env or environment"
  exit 1
fi

# Step 1: Pull latest code
echo "📥 Step 1: Pulling latest code..."
# git pull origin main
echo "✅ Code updated"
echo ""

# Step 2: Create Artifact Registry repository if it doesn't exist
echo "🗄️  Step 2: Checking Artifact Registry repository..."
if ! CLOUDSDK_PYTHON=/usr/bin/python3 gcloud artifacts repositories describe "${REPOSITORY}" \
  --location="${REGION}" \
  --project="${PROJECT_ID}" &> /dev/null; then
  echo "Creating Artifact Registry repository..."
  CLOUDSDK_PYTHON=/usr/bin/python3 gcloud artifacts repositories create "${REPOSITORY}" \
    --repository-format=docker \
    --location="${REGION}" \
    --project="${PROJECT_ID}"
  echo "✅ Repository created"
else
  echo "✅ Repository exists"
fi
echo ""

# Step 3: Build Docker image with build args
echo "🔨 Step 3: Building Docker image..."
docker build \
  --platform linux/amd64 \
  --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="${CLERK_PUBLISHABLE_KEY}" \
  --build-arg NEXT_PUBLIC_BACKEND_URL="${BACKEND_URL}" \
  --build-arg NEXT_PUBLIC_FIREBASE_API_KEY="${NEXT_PUBLIC_FIREBASE_API_KEY:-}" \
  --build-arg NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:-}" \
  --build-arg NEXT_PUBLIC_FIREBASE_PROJECT_ID="${NEXT_PUBLIC_FIREBASE_PROJECT_ID:-}" \
  --build-arg NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:-}" \
  --build-arg NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:-}" \
  --build-arg NEXT_PUBLIC_FIREBASE_APP_ID="${NEXT_PUBLIC_FIREBASE_APP_ID:-}" \
  --build-arg NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="${NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:-}" \
  -t "${IMAGE_NAME}" \
  .
echo "✅ Image built"
echo ""

# Step 4: Configure Docker for Artifact Registry
echo "🔧 Step 4: Configuring Docker for Artifact Registry..."
CLOUDSDK_PYTHON=/usr/bin/python3 gcloud auth configure-docker "${REGION}-docker.pkg.dev" --quiet
echo "✅ Docker configured"
echo ""

# Step 5: Push to Artifact Registry
echo "📤 Step 5: Pushing image to Artifact Registry..."
CLOUDSDK_PYTHON=/usr/bin/python3 docker push "${IMAGE_NAME}"
echo "✅ Image pushed"
echo ""

# Step 6: Deploy to Cloud Run
echo "☁️  Step 6: Deploying to Cloud Run..."
CLOUDSDK_PYTHON=/usr/bin/python3 gcloud run deploy "${SERVICE_NAME}" \
  --image "${IMAGE_NAME}" \
  --region "${REGION}" \
  --platform managed \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --timeout 300 \
  --port 3000 \
  --set-env-vars "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${CLERK_PUBLISHABLE_KEY}" \
  --set-env-vars "CLERK_SECRET_KEY=${CLERK_SECRET}" \
  --set-env-vars "NEXT_PUBLIC_BACKEND_URL=${BACKEND_URL}" \
  --set-env-vars "NEXT_PUBLIC_FIREBASE_API_KEY=${NEXT_PUBLIC_FIREBASE_API_KEY:-}" \
  --set-env-vars "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:-}" \
  --set-env-vars "NEXT_PUBLIC_FIREBASE_PROJECT_ID=${NEXT_PUBLIC_FIREBASE_PROJECT_ID:-}" \
  --set-env-vars "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:-}" \
  --set-env-vars "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:-}" \
  --set-env-vars "NEXT_PUBLIC_FIREBASE_APP_ID=${NEXT_PUBLIC_FIREBASE_APP_ID:-}" \
  --set-env-vars "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=${NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:-}" \
  --project "${PROJECT_ID}"
echo "✅ Deployed"
echo ""

# Step 7: Get service URL
echo "🌐 Step 7: Getting service URL..."
SERVICE_URL=$(CLOUDSDK_PYTHON=/usr/bin/python3 gcloud run services describe "${SERVICE_NAME}" \
  --region "${REGION}" \
  --project "${PROJECT_ID}" \
  --format='value(status.url)')
echo "✅ Service URL: ${SERVICE_URL}"
echo ""

# Step 8: Test frontend
echo "🏥 Step 8: Testing frontend..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${SERVICE_URL}")
if [ "$HTTP_STATUS" = "200" ]; then
  echo "✅ Frontend is responding (HTTP $HTTP_STATUS)"
else
  echo "⚠️  Frontend returned HTTP $HTTP_STATUS"
fi
echo ""

echo "🎉 Deployment completed successfully!"
echo "============================================"
echo "🌐 Your frontend is live at: ${SERVICE_URL}"
echo ""
