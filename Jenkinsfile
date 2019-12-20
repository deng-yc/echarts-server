node {
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
                withDockerRegistry(credentialsId: 'docker-registry', url: 'https://ccr.ccs.tencentyun.com') {
                    def app = docker.build("echart-server:${tag}","-f Dockerfile .");
                    app.push("${tag}");
                    app.push("build-${BUILD_NUMBER}")
                }
            }
        }
}