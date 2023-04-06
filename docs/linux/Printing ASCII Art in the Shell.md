---
title: Printing ASCII Art in the Shell
date: 2023-04-06
sidebar_position: 2
tags: [linux, printing]
keywords: [linux, printing]
---

## banner

```mdx-code-block
<BrowserWindow>
```
```shell
$ sudo apt install sysvbanner
$ banner hello

 #    #  ######  #       #        ####
 #    #  #       #       #       #    #
 ######  #####   #       #       #    #
 #    #  #       #       #       #    #
 #    #  #       #       #       #    #
 #    #  ######  ######  ######   ####
```
```mdx-code-block
</BrowserWindow>
```

## FIGlet

```mdx-code-block
<BrowserWindow>
```
```shell
$ sudo apt install figlet

$ figlet hello
 _          _ _
| |__   ___| | | ___
| '_ \ / _ \ | |/ _ \
| | | |  __/ | | (_) |
|_| |_|\___|_|_|\___/

$ figlet -f mini hello

|_  _ || _
| |(/_||(_)

$ figlet -c hello
                              _          _ _
                             | |__   ___| | | ___
                             | '_ \ / _ \ | |/ _ \
                             | | | |  __/ | | (_) |
                             |_| |_|\___|_|_|\___/

$ figlet -k hello
 _            _  _
| |__    ___ | || |  ___
| '_ \  / _ \| || | / _ \
| | | ||  __/| || || (_) |
|_| |_| \___||_||_| \___/

```
```mdx-code-block
</BrowserWindow>
```

## ToIlet

```mdx-code-block
<BrowserWindow>
```
```shell
$ sudo apt install toilet

$ toilet hello

 #             ""#    ""#
 # mm    mmm     #      #     mmm
 #"  #  #"  #    #      #    #" "#
 #   #  #""""    #      #    #   #
 #   #  "#mm"    "mm    "mm  "#m#"



```
```mdx-code-block
</BrowserWindow>
```