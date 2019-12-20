node {
    def tag="latest"
    withEnv([
        'REGISTRY_API=ccr.ccs.tencentyun.com/eeeban',
        'ROOT_DOMAIN=eeeban.com'
    ]){
            stage('获取代码') {
                checkout([$class: 'GitSCM', branches: [[name: '*/master']],
                    doGenerateSubmoduleConfigurations: false,
                    extensions: [[
                        $class: 'SubmoduleOption',
                        disableSubmodules: false,
                        parentCredentials: false,
                        recursiveSubmodules: true,
                        reference: '',
                        trackingSubmodules: false
                    ]],
                    submoduleCfg: [],
                    userRemoteConfigs: [[
                        credentialsId: 'dengyc',
                        url: 'https://github.com/deng-yc/echarts-server.git'
                    ]]
                ])
            }

            stage('编译镜像') {
                docker.withRegistry('https://ccr.ccs.tencentyun.com','docker-registry'){
                    def image = docker.build("eeeban/echart-server:${tag}","-f src/Dockerfile");
                    echo "--推送 ${tag}--"
                    image.push("${tag}");
                    sh "docker rmi ccr.ccs.tencentyun.com/eeeban/echart-server:${tag}"

                    if(tag=='latest'){
                        echo "--推送 build-${BUILD_NUMBER}"
                        image.push("build-${BUILD_NUMBER}");
                        sh "docker rmi ccr.ccs.tencentyun.com/eeeban/echart-server:build-${BUILD_NUMBER}"
                    }

                    echo "--清理镜像--"
                    sh "docker rmi ${image.id}"
                }
            }
        }
}