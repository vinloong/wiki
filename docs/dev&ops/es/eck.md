

## 使用docker 部署一个集群

```yaml
version: '2.2'
services:
  es01:
    image: elasticsearch:6.8.23
    container_name: es01
    environment:
      - node.name=es01
      - cluster.name=es-docker-cluster
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - data01:/usr/share/elasticsearch/data
    ports:
      - 9200:9200
    networks:
      - elastic
  es02:
    image: elasticsearch:6.8.23
    container_name: es02
    environment:
      - node.name=es02
      - cluster.name=es-docker-cluster
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - "discovery.zen.ping.unicast.hosts=es01"
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - data02:/usr/share/elasticsearch/data
    networks:
      - elastic
  es03:
    image: elasticsearch:6.8.23
    container_name: es03
    environment:
      - node.name=es03
      - cluster.name=es-docker-cluster
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - "discovery.zen.ping.unicast.hosts=es01"
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - data03:/usr/share/elasticsearch/data
    networks:
      - elastic
  kibana:
    image: kibana:6.8.23
    container_name: kibana
    environment:
      ELASTICSEARCH_HOSTS: http://es01:9200
    ports:
      - 5601:5601
    depends_on:
      - es01
    networks:
      - elastic
volumes:
  data01:
    driver: local
  data02:
    driver: local
  data03:
    driver: local

networks:
  elastic:
    driver: bridge


```


## Deploy ECK in your Kubernetes cluster

部署 rbac 和 es operator :

```bash
kubectl create -f https://download.elastic.co/downloads/eck/1.9.1/crds.yaml
kubectl apply -f https://download.elastic.co/downloads/eck/1.9.1/operator.yaml
```

你的k8s 版本是 1.16 之前的版本：

```bash
kubectl create -f https://download.elastic.co/downloads/eck/1.9.1/crds-legacy.yaml
kubectl apply -f https://download.elastic.co/downloads/eck/1.9.1/operator-legacy.yaml
```


## Deploy an Elasticsearch cluster

```bash
cat <<EOF | kubectl apply -f -
apiVersion: elasticsearch.k8s.elastic.co/v1
kind: Elasticsearch
metadata:
  name: quickstart
spec:
  version: 8.3.2
  nodeSets:
  - name: default
    count: 1 # 集群节点数
    config:
      node.store.allow_mmap: false
EOF
```



```yaml
apiVersion: elasticsearch.k8s.elastic.co/v1
kind: Elasticsearch
metadata:
  name: fs-storage
  namespace: elastic-system
spec:
  http:
    tls:
      selfSignedCertificate:
        disabled: true
  version: 6.8.23
  nodeSets:
  - name: master
    count: 3
    config:
      node.master: true
      node.data: false
      node.ingest: false
      node.ml: false
      xpack.ml.enabled: false
      # node.remote_cluster_client: false          
      node.store.allow_mmap: false
    podTemplate:
      spec:
        containers:
        - name: elasticsearch
          env:
          - name: ES_JAVA_OPTS
            value: -Xms2g -Xmx2g
          resources:
            requests:
              memory: 2Gi
              cpu: 4
            limits:
              memory: 4Gi
  - name: data
    count: 3
    config:
      node.master: false
      node.data: true
      node.ingest: true
      node.ml: false
      xpack.ml.enabled: false
      # node.remote_cluster_client: false
      node.store.allow_mmap: false
    podTemplate:
      spec:
        containers:
        - name: elasticsearch
          env:
          - name: ES_JAVA_OPTS
            value: -Xms2g -Xmx2g
          resources:
            requests:
              memory: 2Gi
              cpu: 4
            limits:
              memory: 4Gi              

```

部署 kibana

```yaml
apiVersion: kibana.k8s.elastic.co/v1
kind: Kibana
metadata:
  name: kibana
  namespace: elastic-system
spec:
  version: 6.8.23
  count: 1
  elasticsearchRef:
    name: fs-es
  http:
    tls:
      selfSignedCertificate:
        disabled: false
  podTemplate:
    spec:
      containers:
      - name: kibana
        env:
        - name: I18N_LOCALE
          value: zh-CN
        resources:
          requests:
            memory: 1Gi
          limits:
            memory: 2Gi
```



### CustomResource

```yaml

apiVersion: elasticsearch.k8s.elastic.co/v1
kind: Elasticsearch
metadata:
  name: es-logging
spec:
  version: 6.8.23
  nodeSets:
  - name: es-logging-data
    config:
      # most Elasticsearch configuration parameters are possible to set, e.g: node.attr.attr_name: attr_value
      node.roles: ["data", "ingest"]
      # this allows ES to run on nodes even if their vm.max_map_count has not been increased, at a performance cost
      node.store.allow_mmap: false
    podTemplate:
      metadata:
        labels:
          # additional labels for pods
          node.role: data
      spec:
        # this changes the kernel setting on the node to allow ES to use mmap
        # if you uncomment this init container you will likely also want to remove the
        # "node.store.allow_mmap: false" setting above
        # initContainers:
        # - name: sysctl
        #   securityContext:
        #     privileged: true
        #     runAsUser: 0
        #   command: ['sh', '-c', 'sysctl -w vm.max_map_count=262144']
        ###
        # uncomment the line below if you are using a service mesh such as linkerd2 that uses service account tokens for pod identification.
        # automountServiceAccountToken: true
        containers:
        - name: elasticsearch
          # specify resource limits and requests
          resources:
            limits:
              memory: 4Gi
              cpu: 1
          env:
          - name: ES_JAVA_OPTS
            value: "-Xms2g -Xmx2g"
    count: 3
  - name: es-logging-master
    config:
      # most Elasticsearch configuration parameters are possible to set, e.g: node.attr.attr_name: attr_value
      node.roles: ["master"]
      # this allows ES to run on nodes even if their vm.max_map_count has not been increased, at a performance cost
      node.store.allow_mmap: false
    podTemplate:
      metadata:
        labels:
          # additional labels for pods
          node.role: master
      spec:
        # this changes the kernel setting on the node to allow ES to use mmap
        # if you uncomment this init container you will likely also want to remove the
        # "node.store.allow_mmap: false" setting above
        # initContainers:
        # - name: sysctl
        #   securityContext:
        #     privileged: true
        #     runAsUser: 0
        #   command: ['sh', '-c', 'sysctl -w vm.max_map_count=262144']
        ###
        # uncomment the line below if you are using a service mesh such as linkerd2 that uses service account tokens for pod identification.
        # automountServiceAccountToken: true
        containers:
        - name: elasticsearch
          # specify resource limits and requests
          resources:
            limits:
              memory: 4Gi
              cpu: 1
          env:
          - name: ES_JAVA_OPTS
            value: "-Xms2g -Xmx2g"
    count: 3


  #   # request 2Gi of persistent data storage for pods in this topology element
  #   volumeClaimTemplates:
  #   - metadata:
  #       name: elasticsearch-data # Do not change this name unless you set up a volume mount for the data path.
  #     spec:
  #       accessModes:
  #       - ReadWriteOnce
  #       resources:
  #         requests:
  #           storage: 2Gi
  #       storageClassName: standard
  # # inject secure settings into Elasticsearch nodes from k8s secrets references
  # secureSettings:
  # - secretName: ref-to-secret
  # - secretName: another-ref-to-secret
  #   # expose only a subset of the secret keys (optional)
  #   entries:
  #   - key: value1
  #     path: newkey # project a key to a specific path (optional)
  http:
    service:
      spec:
        type: NodePort
  #   tls:
  #     selfSignedCertificate:
  #       # add a list of SANs into the self-signed HTTP certificate
  #       subjectAltNames:
  #       - ip: 192.168.1.2
  #       - ip: 192.168.1.3
  #       - dns: elasticsearch-sample.example.com
  #     certificate:
  #       # provide your own certificate
  #       secretName: my-cert
```

