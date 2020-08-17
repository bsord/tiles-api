pipeline {
  agent {
    docker {
      image 'node:12-slim'
    }

  }
  stages {
    stage('Install') {
      steps {
        sh 'npm install'
      }
    }

    stage('Test') {
      parallel {
        stage('Lint') {
          steps {
            sh 'npm run lint'
          }
        }

        stage('NPM Test') {
          steps {
            sh 'npm test'
          }
        }

      }
    }

    stage('Audit') {
      parallel {
        stage('NPM Audit') {
          steps {
            sh 'npm audit --audit-level critical'
          }
        }

        stage('MicroScanner') {
          steps {
            sh 'wget https://get.aquasec.com/microscanner'
            sh 'chmod +x microscanner'
            sh './microscanner $MICROSCANNER_TOKEN --continue-on-failure'
          }
        }

      }
    }

    stage('Confirm') {
      steps {
        echo 'Looks good to me'
      }
    }

  }