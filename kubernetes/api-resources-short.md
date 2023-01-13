

| NAME              | SHORTNAMES | APIVERSION | NAMESPACED | KIND            |
| ----------------- | ---------- | ---------- | ---------- | --------------- |
| componentstatuses          | cs         | v1                       | false | ComponentStatus           |
| configmaps                 | cm         | v1                       | true  | ConfigMap                 |
| endpoints                  | ep         | v1                       | true  | Endpoints                 |
| events                     | ev         | v1                       | true  | Event                     |
| limitranges                | limits     | v1                       | true  | LimitRange                |
| namespaces                 | ns         | v1                       | false | Namespace                 |
| nodes                      | no         | v1                       | false | Node                      |
| persistentvolumeclaims     | pvc        | v1                       | true  | PersistentVolumeClaim     |
| persistentvolumes          | pv         | v1                       | false | PersistentVolume          |
| pods                       | po         | v1                       | true  | Pod                       |
| replicationcontrollers     | rc         | v1                       | true  | ReplicationController     |
| resourcequotas             | quota      | v1                       | true  | ResourceQuota             |
| serviceaccounts            | sa         | v1                       | true  | ServiceAccount            |
| services                   | svc        | v1                       | true  | Service                   |
| customresourcedefinitions  | crd,crds   | apiextensions.k8s.io/v1  | false | CustomResourceDefinition  |
| daemonsets                 | ds         | apps/v1                  | true  | DaemonSet                 |
| deployments                | deploy     | apps/v1                  | true  | Deployment                |
| replicasets                | rs         | apps/v1                  | true  | ReplicaSet                |
| statefulsets               | sts        | apps/v1                  | true  | StatefulSet               |
| horizontalpodautoscalers   | hpa        | autoscaling/v1           | true  | HorizontalPodAutoscaler   |
| cronjobs                   | cj         | batch/v1                 | true  | CronJob                   |
| ingresses                  | ing        | networking.k8s.io/v1     | true  | Ingress                   |
| networkpolicies            | netpol     | networking.k8s.io/v1     | true  | NetworkPolicy             |
| priorityclasses            | pc         | scheduling.k8s.io/v1     | false | PriorityClass             |
| storageclasses             | sc         | storage.k8s.io/v1        | false | StorageClass              |

