---
index: false
title: postgresql 优化
date: 2022-05-16
category:
  - dev&ops
tag:
  - postgres
---

# 硬件升级

首先，考虑对系统内存进行升级或者扩容，缓存越多则对磁盘的IO越少，那么性能就越好；
其次，如果应用系统于数据库在同一台主机中，可以考虑将两者分离，这个根据具体情况；

# 系统定向配置

## 配置方法
1. 配置：`data/postgresql.conf`
2. 也可以通过命令修改/查看参数：`ALTER SYSTEM SET` 、`SHOW [name | ALL];`
	```psql
	-- 修改配置
	ALTER SYSTEM SET
	-- 查看当前配置
	SHOW [name | ALL]
	SELECT * FROM pg_settings WHERE pending_restart = true;
	```
3. 另外还可以通过工具 `pgtune`  进行参数调优

## 关键调优参数

- `max_connections` 
  
  > 最大连接数，这个参数设置大小和work_mem有一些关系。配置的越高，可能会占用系统更多的内存。通常可以设置数百个连接，如果要使用上千个连接，建议配置连接池来减少开销。
- `checkpoint_segments` ：检查点 segements，
  
  > 
- `work_mem` ： 工作内存，
  
  > 
- `random_page_cost` ： 随机页时间成本，
  
  > 
- shared_buffers
  
  > 
- Effective_cache_size
  
  > 
- 


## 分析查询性能
### ANALYZE
收集数据库统计信息；查询计划器使用这些统计信息来确定执行查询的最有效方法

```sql
ANALYZE [ ( option [, ...] ) ] [ table_and_columns [, ...] ]
ANALYZE [ VERBOSE ] [ table_and_columns [, ...] ]

where option can be one of:
    VERBOSE [ boolean ]
    SKIP_LOCKED [ boolean ]

and table_and_columns is:
    table_name [ ( column_name [, ...] ) ]
```

### EXPLAIN 
查看语句的执行计划
```sql
EXPLAIN [ ( option [, ...] ) ] statement
EXPLAIN [ ANALYZE ] [ VERBOSE ] statement

where option can be one of:

    ANALYZE [ boolean ]
    VERBOSE [ boolean ]
    COSTS [ boolean ]
    SETTINGS [ boolean ]
    BUFFERS [ boolean ]
    TIMING [ boolean ]
    SUMMARY [ boolean ]
    FORMAT { TEXT | XML | JSON | YAML }
```



```sql
EXPLAIN ANALYZE 
SELECT "workflowProcessVersion".*, "workflowProcessHistories"."id" AS "workflowProcessHistories.id", "workflowProcessHistories"."procinst_id" AS "workflowProcessHistories.procinstId", "workflowProcessHistories"."form_data" AS "workflowProcessHistories.formData", "workflowProcessHistories"."create_at" AS "workflowProcessHistories.createAt", "workflowProcessHistories"."version_id" AS "workflowProcessHistories.versionId", "workflowProcessHistories"."apply_user" AS "workflowProcessHistories.applyUser" FROM (SELECT "workflowProcessVersion"."id", "workflowProcessVersion"."process_id" AS "processId", "workflowProcessVersion"."deployment_id" AS "deploymentId", "workflowProcessVersion"."procdef_id" AS "procdefId", "workflowProcessVersion"."proc_key" AS "procKey", "workflowProcessVersion"."current", "workflowProcessVersion"."create_at" AS "createAt", "workflowProcessVersion"."form_id" AS "formId", "workflowProcessVersion"."bpmn_json" AS "bpmnJson" FROM "workflow_process_version" AS "workflowProcessVersion" WHERE ( SELECT "version_id" FROM "workflow_process_history" AS "workflowProcessHistories" WHERE ("workflowProcessHistories"."procinst_id" = '2b38bb4a-db44-11ec-9537-82994f65ae9b' AND "workflowProcessHistories"."version_id" = "workflowProcessVersion"."id") LIMIT 10 ) IS NOT NULL LIMIT 10) AS "workflowProcessVersion" INNER JOIN "workflow_process_history" AS "workflowProcessHistories" ON "workflowProcessVersion"."id" = "workflowProcessHistories"."version_id" AND "workflowProcessHistories"."procinst_id" = '2b38bb4a-db44-11ec-9537-82994f65ae9b'
```

生成的查询计划:

```shell
Nested Loop  (cost=0.00..274.74 rows=1 width=1488) (actual time=120.895..164.303 rows=1 loops=1)
  Join Filter: ("workflowProcessVersion".id = "workflowProcessHistories".version_id)
  ->  Seq Scan on workflow_process_history "workflowProcessHistories"  (cost=0.00..23.94 rows=1 width=397) (actual time=0.157..0.158 rows=1 loops=1)
        Filter: ((procinst_id)::text = 'a8213277-6e8b-11ec-9e55-ca6fc873b53e'::text)
        Rows Removed by Filter: 284
  ->  Limit  (cost=0.00..250.57 rows=10 width=1091) (actual time=120.733..164.140 rows=1 loops=1)
        ->  Seq Scan on workflow_process_version "workflowProcessVersion"  (cost=0.00..18567.58 rows=741 width=1091) (actual time=120.733..164.139 rows=1 loops=1)
              Filter: ((SubPlan 1) IS NOT NULL)
              Rows Removed by Filter: 755
              SubPlan 1
                ->  Limit  (cost=0.00..24.73 rows=1 width=4) (actual time=0.056..0.056 rows=0 loops=756)
                      ->  Seq Scan on workflow_process_history "workflowProcessHistories_1"  (cost=0.00..24.73 rows=1 width=4) (actual time=0.055..0.055 rows=0 loops=756)
                            Filter: (((procinst_id)::text = 'a8213277-6e8b-11ec-9e55-ca6fc873b53e'::text) AND (version_id = "workflowProcessVersion".id))
                            Rows Removed by Filter: 285
Planning Time: 0.642 ms
Execution Time: 164.355 ms

```

pg 库构建出一个规划节点的树状结构，来表示不同的操作: 根节点和每个``->``指向一个操作：



```
Nested Loop
|___________ Seq Scan
|___________ Limit
               |______ Seq Scan
                          |_____ Limit
                                   |____  Seq Scan
```

每个分支代表一个子动作，从里到外以确定哪个是“第一个”发生（尽管同一级别的节点顺序可能不同）

上面sql 语句中 









## 分析查询日志

> 收集查询日志，作为性能数据的高质量来源

配置 PostgreSQL日志参数，来收集目标查询的日志。

```text
log_line_prefix：

log_statement：

log_statement：

log_checkpoints：

logging_connection：
```


## 添加索引改善查询性能
如果没有索引，对数据库的每个请求都将导致对整个表进行全面扫描，以查找相关结果。这在数据集很大时，会非常缓慢，索引就是为解决这个问题而来。就像一本书中的索引一样，索引会向数据库引擎提供有关正在寻找的数据在系统中大致位置的信息。要正确索引我们的系统，需要了解数据以及如何尝试访问它。

但是，索引并不是免费的，就像每次更新书中内容时需要更新索引，数据库中表每次更新后必须更新索引。**索引可以降低查询的成本，但会增加更新的成本。**

PostgreSQL中的索引类型（根据算法分）有以下5种。PostgreSQL中，在创建主键和唯一键约束时，将会创建隐式索引；其他的索引需要手动添加。
-   B-tree (默认索引)：适用于快速随机访问及其他大多数情况；
-   Hash：适用于快速定位某行；
-   GiST
-   SP-GiST
-   GIN
但是，在某些用例中不应使用索引，例如：
当使用索引的开销超过算法的好处时，比如在小表中；
在对表执行大量批处理update时，也可能看到性能问题：在update这些表时，暂时删除这些表上的索引，之后再还原索引，可能对这些表的update性能很有意义。