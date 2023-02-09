---
index: false
icon: linux
title: 如何查看busybox 版本
date: 2022-04-18
category:
  - linux
tag:
  - busybox
  - version
---

# 如何查看busybox 版本



## 使用 `ls -j`

```bash
$ ls -j
ls: invalid option -- j
BusyBox v1.34.1 (2021-10-26 18:45:18 UTC) multi-call binary.

Usage: ls [-1AaCxdLHRFplinshrSXvctu] [-w WIDTH] [FILE]...

List directory contents

	-1	One column output
	-a	Include names starting with .
	-A	Like -a, but exclude . and ..
	-x	List by lines
	-d	List directory names, not contents
	-L	Follow symlinks
	-H	Follow symlinks on command line
	-R	Recurse
	-p	Append / to directory names
	-F	Append indicator (one of */=@|) to names
	-l	Long format
	-i	List inode numbers
	-n	List numeric UIDs and GIDs instead of names
	-s	List allocated blocks
	-lc	List ctime
	-lu	List atime
	--full-time	List full date/time
	-h	Human readable sizes (1K 243M 2G)
	--group-directories-first
	-S	Sort by size
	-X	Sort by extension
	-v	Sort by version
	-t	Sort by mtime
	-tc	Sort by ctime
	-tu	Sort by atime
	-r	Reverse sort order
	-w N	Format N columns wide
	--color[={always,never,auto}]

```



## 使用 `uname -u`

```bash
$ uname -u
uname: invalid option -- u
BusyBox v1.34.1 (2021-10-26 18:45:18 UTC) multi-call binary.

Usage: uname [-amnrspvio]

Print system information

	-a	Print all
	-m	Machine (hardware) type
	-n	Hostname
	-r	Kernel release
	-s	Kernel name (default)
	-p	Processor type
	-v	Kernel version
	-i	Hardware platform
	-o	OS name

```



## 使用 `time`

```bash
$ time
BusyBox v1.34.1 (2021-10-26 18:45:18 UTC) multi-call binary.

Usage: time [-vpa] [-o FILE] PROG ARGS

Run PROG, display resource usage when it exits

	-v	Verbose
	-p	POSIX output format
	-f FMT	Custom format
	-o FILE	Write result to FILE
	-a	Append (else overwrite)

```



## 使用 `basename`

```bash
$ basename
BusyBox v1.34.1 (2021-10-26 18:45:18 UTC) multi-call binary.

Usage: basename FILE [SUFFIX]

Strip directory path and .SUFFIX from FILE

```



## 使用 `vconfig`

```bash
# vconfig
BusyBox v1.34.1 (2021-10-26 18:45:18 UTC) multi-call binary.

Usage: vconfig COMMAND [OPTIONS]

Create and remove virtual ethernet devices

	add IFACE VLAN_ID
	rem VLAN_NAME
	set_flag IFACE 0|1 VLAN_QOS
	set_egress_map VLAN_NAME SKB_PRIO VLAN_QOS
	set_ingress_map VLAN_NAME SKB_PRIO VLAN_QOS
	set_name_type NAME_TYPE

```

