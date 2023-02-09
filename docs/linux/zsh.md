

## install 

```bash
# 安装
sudo apt install zsh

# 将 zsh 设置为默认 shell
chsh -s /bin/zsh

# 检查
echo $SHELL
# 返回 /usr/bin/zsh 即表示成功；若没成功，重启试试看

```



## install `Oh My Zsh`

> Oh My Zsh 是基于 Zsh 命令行的一个扩展工具集，提供了丰富的扩展功能，如：主题配置，插件机制，内置的便捷操作等，，可以给我们一种全新的命令行使用体验。

```shell
% 通过 curl
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

% 或者 通过 wget
sh -c "$(wget -O- https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

```



## 配置



1. 自动补全插件 `zsh-autosuggestions`

   ```shell
   git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
   ```

   

2. 代码高亮 `zsh-syntax-highlighting`

   ```shell
   git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
   ```
   
   
   
3. 快速打开 GitHub 仓库 `git-open`

   ```shell
   git clone https://github.com/paulirish/git-open.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/git-open`
   ```

4. 最后需要配置 `plugins`

    ```shell
    plugins=( 
    	git 
    	zsh-autosuggestions 
    	zsh-syntax-highlighting 
    	git-open 
    )
    ```
   
    


5.  主题

   在 [这里](https://github.com/ohmyzsh/ohmyzsh/wiki/Themes) 选择喜欢的主题，将名称填入根目录 `.zshrc` 中对应位置

   ```
   ZSH_THEME="theme name"
   ```

