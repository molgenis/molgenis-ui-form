pipeline {
  agent {
    kubernetes {
      // the shared pod template defined on the Jenkins server config
      inheritFrom 'shared'
      // molgenis-frontend pod template defined in molgenis/molgenis-jenkins-pipeline repository
      yaml libraryResource("pod-templates/molgenis-frontend.yaml")
    }
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
            env.SAUCE_CRED_USR = sh(script: 'vault read -field=username secret/ops/token/saucelabs', returnStdout: true)
            env.SAUCE_CRED_PSW = sh(script: 'vault read -field=accesskey secret/ops/token/saucelabs', returnStdout: true)
            env.GITHUB_TOKEN = sh(script: 'vault read -field=value secret/ops/token/github', returnStdout: true)
            env.CODECOV_TOKEN = sh(script: 'vault read -field=molgenis-ui-form secret/ops/token/codecov', returnStdout: true)
            env.NPM_TOKEN = sh(script: 'vault read -field=value secret/ops/token/npm', returnStdout: true)
          }
        }
        container('node') {
          // We intermittently get a DNS error: non-recoverable failure in name resolution (-4)
          // To prevent this, use Google DNS server instead
          sh "daemon --name=sauceconnect -- /usr/local/bin/sc --dns 8.8.8.8,8.8.4.4:53 --readyfile /tmp/sauce-ready.txt -u ${SAUCE_CRED_USR} -k ${SAUCE_CRED_PSW} -i ${TUNNEL_IDENTIFIER}"
          timeout (1) {
            sh "while [ ! -f /tmp/sauce-ready.txt ]; do sleep 1; done"
          }
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
          sh "yarn lint"
          sh "yarn unit"
          sh "yarn e2e --env ci_firefox"
          sh "yarn e2e --env ci_safari"
          sh "yarn e2e --env ci_chrome"
        }
      }
      post {
        always {
          container('node') {
            fetch_codecov()
            sh "./codecov -c -F unit -K -C ${GIT_COMMIT}"
            sh "rm codecov"
          }
        }
      }
    }
    stage('Build: [ master ]') {
      when {
        allOf {
          branch 'master'
          not {
            changelog '.*\\[skip ci\\]$'
          }
        }
      }
      steps {
        milestone 1
        container('node') {
          sh "yarn install"
          sh "yarn lint"
          sh "yarn unit"
        }
      }
      post {
        always {
          container('node') {
            fetch_codecov()
            sh "./codecov -c -F unit -K -C ${GIT_COMMIT}"
            sh "rm codecov"
          }
        }
      }
    }
    stage('Release: [ master ]') {
      when {
        allOf {
          branch 'master'
          not {
            changelog '.*\\[skip ci\\]$'
          }
        }
      }
      environment {
        GIT_AUTHOR_EMAIL = 'molgenis+ci@gmail.com'
        GIT_AUTHOR_NAME = 'molgenis-jenkins'
        GIT_COMMITTER_EMAIL = 'molgenis+ci@gmail.com'
        GIT_COMMITTER_NAME = 'molgenis-jenkins'
      }
      steps {
        milestone 2
        container('node') {
          sh "npm config set unsafe-perm true"
          sh "npx semantic-release"
        }
      }
    }
  }
  post {
    failure {
      hubotSend(message: 'Build failed', status:'ERROR', site: 'slack-pr-app-team')
    }
    always {
      container('node') {
        sh "daemon --name=sauceconnect --stop"
      }
    }
  }
}
