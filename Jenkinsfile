pipeline {
  agent any
  stages {
    stage('Preparation') {
      steps {
        // Backup has started
        // notifyStarted()
        // Clean workspace
        step([$class: 'WsCleanup', cleanWhenFailure: false])
        // Get code from github.com
        checkout changelog: false, poll: false, scm: [$class: 'GitSCM', branches: feature/jenkins, doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'jenkins-git', url: 'http://jenkins@github.com/molgenis/molgenis-vue-forms.git']]]
      }
    }
    stage('Test VUE-forms') {
      steps {
        echo "Build the MOLGENIS Vue forms"
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
        // Login with molgenis Jenkins
        // Publish to NPM
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

def notifyStarted() {
  slackSend (channel: '#releases', color: '#FFFF00', message: "STARTED: Job - <${env.BUILD_URL}|${env.JOB_NAME}> | #${env.BUILD_NUMBER}")
}
def notifySuccess() {
  slackSend (channel: '#releases', color: '#00FF00', message: "SUCCESSFUL: Job - <${env.BUILD_URL}|${env.JOB_NAME}> | #${env.BUILD_NUMBER}")
}
def notifyFailed() {
  slackSend (channel: '#releases', color: '#FF0000', message: "FAILED: Job - <${env.BUILD_URL}|${env.JOB_NAME}> | #${env.BUILD_NUMBER}")
}