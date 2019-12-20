node{
    def tag='latest';
    def aspnet_env='Production'
    def k8s_namespace="hehe"
    def git_branch="*/master"
    if (params.get('__DEV__', false)){
        tag='dev'
        aspnet_env='Stage'
        k8s_namespace="hehe-dev"
        git_branch="*/dev"
    }
    withEnv([
        'REGISTRY_API=ccr.ccs.tencentyun.com/hehelist',
        'ROOT_DOMAIN=myhehe.com',
        "ASPNETCORE_ENVIRONMENT=${aspnet_env}",
        "TAG=${tag}",
        "NAMESPACE=${k8s_namespace}"
    ]){
        stage('获取代码') {
            checkout([$class: 'GitSCM', branches: [[name: "${git_branch}"]],
                doGenerateSubmoduleConfigurations: false,
                extensions: [[
                    $class: 'SubmoduleOption',
                    disableSubmodules: false,
                    parentCredentials: false,
                    recursiveSubmodules: true,
                    reference: '',
                    trackingSubmodules: false
                ]],
                submoduleCfg: [],
                userRemoteConfigs: [[
                    credentialsId: 'dengyc',
                    url: 'https://github.com/deng-yc/echarts-server.git'
                ]]
            ])
        }

        stage('编译镜像') {
            withDockerRegistry(credentialsId: 'docker-registry', url: 'https://ccr.ccs.tencentyun.com') {
                def app = docker.build("echart-server:${tag}","-f Dockerfile .");
                app.push(tag);
                app.push("build-${BUILD_NUMBER}");
            }
        }

        stage("删除源码"){
            sh 'git checkout .'
        }
    }
}