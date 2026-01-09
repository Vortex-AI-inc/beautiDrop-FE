# Staging Environment Deployment Guide

This guide explains how to set up and deploy the `staging` branch to GCP Cloud Run.

## 1. Why Separate Secrets?

**NEVER reuse production secrets for staging.** 
- **Isolation:** Staging data should not mix with production (Firebase/Clerk).
- **Backend URL:** Staging frontend must point to the staging backend API.
- **Safety:** Prevents accidental modification of production resources.

## 2. Setting Up Secrets (GCP Secret Manager)

You should create staging versions of **all secrets** in GCP Secret Manager with the `-staging` suffix. This ensures your staging environment is completely independent.

```bash
# Example: Create a staging secret
gcloud secrets create SECRET_NAME_HERE-staging --replication-policy="automatic"
echo -n "SECRET_VALUE" | gcloud secrets versions add SECRET_NAME_HERE-staging --data-file=-
```

**List of secrets to create:**
1. `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY-staging`
2. `CLERK_SECRET_KEY-staging`
3. `NEXT_PUBLIC_BACKEND_URL-staging`
4. `NEXT_PUBLIC_FIREBASE_API_KEY-staging`
5. `NEXT_PUBLIC_FIREBASE_APP_ID-staging`
6. `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN-staging`
7. `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID-staging`
8. `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID-staging`
9. `NEXT_PUBLIC_FIREBASE_PROJECT_ID-staging`
10. `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET-staging`

## 3. Create Cloud Build Trigger

1. Go to **Cloud Build > Triggers** in GCP Console.
2. Click **Create Trigger**.
3. **Name:** `beautydrop-frontend-staging-deploy`
4. **Event:** Push to a branch.
5. **Source:** Select your repository (`beautiDrop-FE`).
6. **Branch:** `^staging$`
7. **Configuration:** Cloud Build configuration file.
8. **File location:** `/cloudbuild-staging.yaml`

## 4. Cloud Run Service

You **do not** need to create the service manually. The first build success will automatically create a service named `beautydrop-frontend-staging`.

## 5. Manual Build (Testing)

Run this to test the configuration before setting up the trigger:
```bash
gcloud builds submit --config=cloudbuild-staging.yaml .
```

## 5. Deployment Details

- **Service Name:** `beautydrop-frontend-staging`
- **Region:** `us-east1`
- **Memory:** `256Mi`
- **CPU:** `0.5`
- **URL:** You will get a separate `.a.run.app` URL for staging.

> [!NOTE]
> Since Next.js "bakes in" `NEXT_PUBLIC_` variables at build time, changing the `NEXT_PUBLIC_BACKEND_URL-staging` secret later will require a new build/deployment to take effect.
