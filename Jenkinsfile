pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-2'
        AWS_ACCOUNT_ID = '847776737366'
        ECR_REPOSITORY = 'shopsphere'
        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        IMAGE_NAME = "${ECR_REGISTRY}/${ECR_REPOSITORY}"
        K8S_NAMESPACE = 'shopsphere'
        K8S_DEPLOYMENT = 'shopsphere'
        K8S_CONTAINER = 'shopsphere'
        KUBECONFIG = '/var/lib/jenkins/.kube/config'

	DATABASE_URL = credentials('shopsphere-database-url')
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out source code from GitHub...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing Node.js dependencies...'
                sh 'npm ci'
            }
        }

        stage('Check Database Configuration') {
            steps {
                sh '''
                   if [ -z "$DATABASE_URL" ]; then
                       echo "ERROR: DATABASE_URL is empty"
                       exit 1
                   fi

                   case "$DATABASE_URL" in
                       postgresql://*|postgres://*)
                           echo "DATABASE_URL is present and has a valid PostgreSQL protocol."
                           ;;
                       *)
                           echo "ERROR: DATABASE_URL does not start with postgresql:// or postgres://"
                           exit 1
                           ;;
                   esac
                '''
            }
        }
	
	stage('Prisma Validate') {
            steps {
                echo 'Validating Prisma schema...'
                sh 'npx prisma validate'
            }
        }

        stage('Prisma Generate') {
            steps {
                echo 'Generating Prisma Client...'
                sh 'npx prisma generate'
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running automated tests...'
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    env.IMAGE_TAG = "${BUILD_NUMBER}"

                    echo "Building Docker image: ${IMAGE_NAME}:${IMAGE_TAG}"

                    sh """
                        docker build \
                          -t ${IMAGE_NAME}:${IMAGE_TAG} \
                          -t ${IMAGE_NAME}:latest \
                          .
                    """
                }
            }
        }

        stage('Push Image to ECR') {
            steps {
                echo 'Authenticating with Amazon ECR...'

                sh """
                    aws ecr get-login-password --region ${AWS_REGION} | \
                    docker login \
                      --username AWS \
                      --password-stdin ${ECR_REGISTRY}
                """

                echo 'Pushing image to Amazon ECR...'

                sh """
                    docker push ${IMAGE_NAME}:${IMAGE_TAG}
                    docker push ${IMAGE_NAME}:latest
                """
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo "Deploying ${IMAGE_NAME}:${IMAGE_TAG} to Kubernetes..."

                sh """
                    kubectl apply -f k8s/namespace.yaml
                    kubectl apply -f k8s/deployment.yaml
                    kubectl apply -f k8s/service.yaml

                    kubectl set image \
                      deployment/${K8S_DEPLOYMENT} \
                      ${K8S_CONTAINER}=${IMAGE_NAME}:${IMAGE_TAG} \
                      -n ${K8S_NAMESPACE}

                    kubectl rollout status \
                      deployment/${K8S_DEPLOYMENT} \
                      -n ${K8S_NAMESPACE} \
                      --timeout=180s
                """
            }
        }

        stage('Verify Deployment') {
            steps {
                echo 'Verifying Kubernetes deployment...'

                sh """
                    kubectl get deployment ${K8S_DEPLOYMENT} \
                      -n ${K8S_NAMESPACE}

                    kubectl get pods \
                      -n ${K8S_NAMESPACE} \
                      -o wide

                    kubectl get service \
                      ${K8S_DEPLOYMENT} \
                      -n ${K8S_NAMESPACE}
                """
            }
        }
    }

    post {
        success {
            echo """
            ========================================
            SHOPSPHERE PIPELINE SUCCESSFUL
            ========================================
            Build: ${BUILD_NUMBER}
            Image: ${IMAGE_NAME}:${IMAGE_TAG}
            Kubernetes namespace: ${K8S_NAMESPACE}
            ========================================
            """
        }

        failure {
            echo """
            ========================================
            SHOPSPHERE PIPELINE FAILED
            ========================================
            Build: ${BUILD_NUMBER}
            Check the Jenkins console output.
            ========================================
            """
        }

        always {
            echo "Pipeline completed: ${currentBuild.currentResult}"
        }
    }
}
