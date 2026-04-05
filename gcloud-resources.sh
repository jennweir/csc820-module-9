#!/usr/bin/env bash

export WIF_POOL="gitlab-ci"
export WIF_PROVIDER="gitlab-gitlab-ci"
export PROJECT_ID="project-1ec027c6-aa52-4cc0-aa8"
export GITLAB_NAMESPACE_ID="128951886"
export SUBJECT="project_path:jenniferp.weir/csc820-application" # the gitlab ci project path

# https://docs.cloud.google.com/iam/docs/workload-identity-federation-with-deployment-pipelines#gcloud_1

gcloud iam workload-identity-pools create $WIF_POOL \
    --location="global" \
    --description="pool for authentication with gitlab ci" \
    --display-name="gitlab-ci"

gcloud iam workload-identity-pools providers create-oidc $WIF_PROVIDER \
    --location="global" \
    --workload-identity-pool=$WIF_POOL \
    --issuer-uri="https://gitlab.com" \
    --attribute-mapping="google.subject=assertion.sub,attribute.namespace_id=assertion.namespace_id" \
    --attribute-condition="assertion.namespace_id=='$GITLAB_NAMESPACE_ID'"

gcloud projects add-iam-policy-binding project-1ec027c6-aa52-4cc0-aa8 \
    --member="principal://iam.googleapis.com/projects/877046273961/locations/global/workloadIdentityPools/gitlab-ci/subject/project_path:jenniferp.weir/csc820-application:ref_type:branch:ref:main" \
    --role="roles/container.developer"

gcloud projects add-iam-policy-binding project-1ec027c6-aa52-4cc0-aa8 \
    --member="principal://iam.googleapis.com/projects/877046273961/locations/global/workloadIdentityPools/gitlab-ci/subject/project_path:jenniferp.weir/csc820-application:ref_type:branch:ref:main" \
    --role="roles/viewer"