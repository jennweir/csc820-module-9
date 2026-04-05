#!/usr/bin/env bash

export WIF_POOL="gitlab"
export WIF_PROVIDER="gitlab-gitlab"
export SA_NAME="sa-deployer"
export PROJECT_ID="project-1ec027c6-aa52-4cc0-aa8"
export PROJECT_NUMBER="877046273961"
export GITLAB_NAMESPACE_ID="36474446"
export SUBJECT="project_path:jennweir/*" # the gitlab ci project path under the jennweir namespace

# https://docs.cloud.google.com/iam/docs/workload-identity-federation-with-deployment-pipelines#gcloud_1

gcloud iam workload-identity-pools create $WIF_POOL \
    --location="global" \
    --description="pool for authentication with gitlab ci" \
    --display-name="gitlab"

gcloud iam workload-identity-pools providers create-oidc $WIF_PROVIDER \
    --location="global" \
    --workload-identity-pool=$WIF_POOL \
    --issuer-uri="https://gitlab.com" \
    --attribute-mapping="google.subject=assertion.sub,attribute.namespace_id=assertion.namespace_id" \
    --attribute-condition="assertion.namespace_id=='$GITLAB_NAMESPACE_ID'"

gcloud iam service-accounts add-iam-policy-binding $SA_NAME@$PROJECT_ID.iam.gserviceaccount.com \
    --role=roles/iam.workloadIdentityUser \
    --member="principal://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/$WIF_POOL/subject/$SUBJECT"