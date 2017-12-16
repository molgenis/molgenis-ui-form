pipeline {
  agent any
  stages {
    stage('Preparation') {
      steps {
        // Clean workspace
        step([$class: 'WsCleanup', cleanWhenFailure: false])
        // Get code from github.com
        checkout changelog: false, poll: false, scm: [$class: 'GitSCM', branches: [[name: 'master']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'jenkins-molgenis', url: 'http://github.com/sidohaakma/molgenis-vue-form.git']]]
      }
    }
    stage('Test VUE-forms') {
      steps {
        echo "Build the MOLGENIS Vue forms"
        sh "yarn install"
        sh "yarn run test"
      }
    }
    stage('Build VUE-forms') {
      steps {
        echo "Build VUE-forms"
        sh "yarn run build"
      }
    }
    stage('Publish VUE-forms') {
      steps {
        echo "Publish VUE-forms"
        // Get token from environment vriable NPM_TOKEN in
        // Jenkins organization
        // Publish to NPM
        sh "npm run ci-publish || true"
      }
    }
    stage('Update VUE-forms documentation') {
      steps {
        echo "Publish VUE-forms"
        // Login with molgenis Jenkins credentials

      }
    }
  }
  // post {
  //  success {
  //    notifySuccess()
  //  }
  //  failure {
  //    notifyFailed()
  //  }
  // }
}

def notifySuccess() {
  slackSend (channel: '#releases', color: '#00FF00', message: "SUCCESSFUL: Job - <${env.BUILD_URL}|${env.JOB_NAME}> | #${env.BUILD_NUMBER}")
}
def notifyFailed() {
  slackSend (channel: '#releases', color: '#FF0000', message: "FAILED: Job - <${env.BUILD_URL}|${env.JOB_NAME}> | #${env.BUILD_NUMBER}")
}