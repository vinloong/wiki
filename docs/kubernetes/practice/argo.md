## install 

```
kubectl create ns argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```



## add user

```shell
argocd login argocd-server.argocd --username admin  --password Abcd_1234

argocd account list

```



### Update the ConfigMap

```bash
kubectl edit configmap argocd-cm -n argocd
```
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: argocd-cm
  namespace: argocd
  labels:
    app.kubernetes.io/name: argocd-cm
    app.kubernetes.io/part-of: argocd
data:
  accounts.admin: apiKey
  accounts.liyu: apiKey,login
  accounts.<new-username>: apiKey, login
```

### Update the Users Password

```
argocd account update-password --account liyu --new-password abcd1234
```

### Update the Role Base Access Control (RBAC) for Local User

```shell
kubectl get configmap argocd-rbac-cm
```

```yaml
data:
  policy.csv: |
    p, role:org-admin, applications, *, */*, allow
    p, role:org-admin, clusters, get, *, allow
    p, role:org-admin, repositories, get, *, allow
    p, role:org-admin, repositories, create, *, allow
    p, role:org-admin, repositories, update, *, allow
    p, role:org-admin, repositories, delete, *, allow
    g, <new-user>, role:org-admin
  policy.default: role:''
```



```yaml
p, role:<assigned-role>, gpgkeys, get, *, allow
```



### Disabled Admin Account

```yaml
data:
  admin.enabled: "false"
```

