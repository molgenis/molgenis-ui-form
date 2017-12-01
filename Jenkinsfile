pipeline {
  agent any
  triggers {
    // github
    cron ''
  }
  stages {
    stage('Preparation') {
      steps {
        // Backup has started
        notifyStarted()
        // Clean workspace
        step([$class: 'WsCleanup', cleanWhenFailure: false])
        // Get code from github.com
        checkout changelog: false, poll: false, scm: [$class: 'GitSCM', branches: [[name: 'master']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'jenkins-git', url: 'http://jenkins@github.com/haakma-org/haakma-org.git']]]
      }
    }
    stage('Test VUE-forms') {
      steps {
        echo "Build the MOLGENIS Vue forms"
        yarn run test
      }
    }
    stage('Test VUE-forms') {
      steps {
        echo "Build VUE-forms"
        yarn run build
      }
    }
    stage('Publish VUE-forms') {
      steps {
        echo "Publish VUE-forms"
        // Login with molgenis Jenkins
        npm publish --scope=@molgenis --access=public
      }
    }
    stage('Update VUE-forms documentation') {
      steps {
        echo "Publish VUE-forms"
        // Login with molgenis Jenkins
        npm publish --scope=@molgenis --access=public
      }
    }
  }
  post {
    success {
      notifySuccess()
    }
    failure {
      notifyFailed()
    }
  }
}

def notifyStarted() {
  slackSend (channel: '#haakma-org', color: '#FFFF00', message: "STARTED: Job - <${env.BUILD_URL}|${env.JOB_NAME}> | #${env.BUILD_NUMBER}")
}
def notifySuccess() {
  slackSend (channel: '#haakma-org', color: '#00FF00', message: "SUCCESSFUL: Job - <${env.BUILD_URL}|${env.JOB_NAME}> | #${env.BUILD_NUMBER}")
}
def notifyFailed() {
  slackSend (channel: '#haakma-org', color: '#FF0000', message: "FAILED: Job - <${env.BUILD_URL}|${env.JOB_NAME}> | #${env.BUILD_NUMBER}")
}