pipeline {
  agent any
  environment {
    COMPONENT_NAME = "molgenis-ui-form"
    COMPONENT_VERSION = "${gitTag}"
  }
  stages {
    stage('Preparationn') {
      steps {
        // Clean workspace
        step([$class: 'WsCleanup', cleanWhenFailure: false])
        // Get code from github.com
        checkout changelog: false, poll: false, scm: [$class: 'GitSCM', branches: [[name: 'master']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'jenkins-molgenis', url: 'http://github.com/sidohaakma/molgenis-vue-form.git']]]
      }
    }
    stage('Build UI-component') {
      steps {
        echo "Build the MOLGENIS Vue forms"
        sh "yarn install"
        sh "yarn build"
      }
    }
    stage('Test UI-component') {
      steps {
        echo "Build VUE-forms"
        sh "yarn test"
      }
    }
    stage('Publish UI-component') {
      steps {
        echo "Publish UI-component"
        // Get token from environment vriable NPM_TOKEN in
        // Jenkins organization`
        // Publish to NPM
        sh "set -e; echo '//registry.npmjs.org/:_authToken=${NPM_TOKEN}' > ~/.npmrc"
        sh "npm publish --access public --scope haakma-org"
      }
    }
    stage('Update UI-component documentation') {
      steps {
        echo "Publish UI-component documentation"
        sh "tar -cvzf src/ ${COMPONENT_NAME}.tar"
        sh "cp molgenis-ui-form.tar /srv/www/molgenis-kitchensink/components/${COMPONENT_NAME}/${COMPONENT_VERSION}/"
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