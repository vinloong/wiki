## 配置

### pod 模板配置

 ![](https://raw.githubusercontent.com/vinloong/imgchr/main/notes/2023/03/17/15-32-11-a7da1a.png)

 ![](https://raw.githubusercontent.com/vinloong/imgchr/main/notes/2023/03/17/15-39-38-412fb7.png)

 ![](https://raw.githubusercontent.com/vinloong/imgchr/main/notes/2023/03/17/15-41-44-2c5505.png) ![](https://raw.githubusercontent.com/vinloong/imgchr/main/notes/2023/03/17/15-41-44-2c5505.png)


 ![](https://raw.githubusercontent.com/vinloong/imgchr/main/notes/2023/03/17/15-47-40-80b4a7.png)


![](https://raw.githubusercontent.com/vinloong/imgchr/main/notes/2023/03/17/15-57-33-283e0c.png)


```yaml
apiVersion: v1
data:
  config.json: >-
    ewo9CiXV0aCAgInJlZ2lzdHJ5Lm5nYWlvdC5jb20iOiB7CiAgICAgmxwMlRTMGtkaAgIH0KfICAiYXV0aCI6ICJZblZwYkdSbHMiOiBgICAiYk50UTJGRyIKICAgICB7CiAgIGNqcFNkbWg1VQ==
kind: Secret
metadata:
  name: image-registry-auths-config
  namespace: devops-tools
type: Opaque

```

```json
{
   "auths": {
     "registry.xxxxx.com": {
       "auth": "bGdmh5RlS0kdjcjpSVlp2TNtYnVpQ2FG"
     }
   }
}
```



## pipeline


```pipeline
podTemplate {
    # 使用哪个 pod 模板 label
    node('pod-templ-jenkins-slave-common') {
        stage('Run shell') { 
              # 下载代码
              git url: 'https://gitea.ngaiot.com/free-sun-zhenjiang/node.git', branch: 'main', credentialsId: 'gitea-builder'
              # 在哪个容器里执行命令
              # 容器模板里的 container name
              container('image-build') {
                  sh '''
                    # 这个实际使用时不用
                    # 看 是否配置仓库授权
                    cat /kaniko/.docker/config.json
                    
                    # 构建镜像
                    # --dockerfile: Dockerfile 的路径
                    # --destination: 推送的 image 
                    # 构建完成后会自动推送
                    /kaniko/executor --dockerfile=dev/12/Dockerfile --destination=registry.ngaiot.com/${DEVOPS}/node:12-fs-${IMAGE_VERSION}
                  '''
              }
        }
    }
}


```

## 环境变量

```
DEVOPS
FS-CLOUD
IMAGE_VERSION
IOT
ZHIWUCLOUD

...
...

```



