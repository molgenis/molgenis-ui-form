pipeline {
  agent {
    kubernetes {
      label 'node-carbon'
    }
  }
  environment {
    npm_config_registry = 'http://nexus.molgenis-nexus:8081/repository/npm-central/'
  }
  stages {
    stage('Prepare') {
      steps {
        script {
          env.GIT_COMMIT = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
        }
        container('vault') {
          script {
            env.TUNNEL_IDENTIFIER = sh(script: 'echo ${GIT_COMMIT}-${BUILD_NUMBER}', returnStdout: true)
            env.GITHUB_TOKEN = sh(script: 'vault read -field=value secret/ops/token/github', returnStdout: true)
            env.CODECOV_TOKEN = sh(script: 'vault read -field=value secret/ops/token/codecov', returnStdout: true)
            env.SAUCE_CRED_USR = sh(script: 'vault read -field=username secret/ops/token/saucelabs', returnStdout: true)
            env.SAUCE_CRED_PSW = sh(script: 'vault read -field=value secret/ops/token/saucelabs', returnStdout: true)
            env.NPM_TOKEN = sh(script: 'vault read -field=value secret/ops/token/npm', returnStdout: true)
          }
        }
        container('node') {
          sh "daemon --name=sauceconnect -- /usr/local/bin/sc -u ${SAUCE_CRED_USR} -k ${SAUCE_CRED_PSW} -i ${TUNNEL_IDENTIFIER}"
        }
      }
    }
    stage('Build: [ pull request ]') {
      when {
        changeRequest()
      }
      steps {
        container('node') {
          sh "yarn install"
          sh "yarn unit"
          sh "yarn e2e --env ci_chrome,ci_safari,ci_ie11,ci_firefox"
        }
      }
      post {
        always {
          container('node') {
            sh "curl -s https://codecov.io/bash | bash -s - -c -F unit -K"
          }
        }
      }
    }
    stage('Build: [ master ]') {
      when {
        branch 'master'
      }
      steps {
        milestone 1
        container('node') {
          sh "yarn install"
          sh "yarn unit"
          sh "yarn e2e --env ci_chrome,ci_safari,ci_ie11,ci_firefox"
        }
      }
      post {
        always {
          container('node') {
            sh "curl -s https://codecov.io/bash | bash -s - -c -F unit -K"
          }
        }
      }
    }
    stage('Release: [ master ]') {
      when {
        branch 'master'
      }
      environment {
        ORG = 'molgenis'
        APP_NAME = 'molgenis-ui-form'
        REGISTRY = 'registry.npmjs.org'
      }
      steps {
        timeout(time: 30, unit: 'MINUTES') {
          script {
            env.RELEASE_SCOPE = input(
              message: 'Do you want to release?',
              ok: 'Release',
              parameters: [
                choice(choices: 'patch\nminor\nmajor', description: '', name: 'RELEASE_SCOPE')
              ]
            )
          }
        }
        milestone 2
        container('node') {
          sh "git config --global user.email molgenis+ci@gmail.com"
          sh "git config --global user.name molgenis-jenkins"
          sh "git remote set-url origin https://${GITHUB_TOKEN}@github.com/${ORG}/${APP_NAME}.git"

          sh "git checkout -f ${BRANCH_NAME}"

          sh "npm config set unsafe-perm true"
          sh "npm version ${RELEASE_SCOPE} -m '[ci skip] [npm-version] %s'"

          sh "git push --tags origin ${BRANCH_NAME}"

          sh "echo //${REGISTRY}/:_authToken=${NPM_TOKEN} > ~/.npmrc"

          sh "npm publish"
        }
      }
    }
  }
  post {
    always {
      container('node') {
        sh "daemon --name=sauceconnect --stop"
      }
    }
    // [ slackSend ]; has to be configured on the host, it is the "Slack Notification Plugin" that has to be installed
    success {
      notifySuccess()
    }
    failure {
      notifyFailed()
    }
  }
}

def notifySuccess() {
  slackSend(channel: '#releases', color: '#00FF00', message: 'JS-module-build is successfully deployed on https://registry.npmjs.org: Job - <${env.BUILD_URL}|${env.JOB_NAME}> | #${env.BUILD_NUMBER}')
}

def notifyFailed() {
  slackSend(channel: '#releases', color: '#FF0000', message: 'JS-module-build has failed: Job - <${env.BUILD_URL}|${env.JOB_NAME}> | #${env.BUILD_NUMBER}')
}
