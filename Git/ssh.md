## Github SSH协议配置

### 1. 检查是否已有 SSH Key

在操作之前，先看看你电脑上是否已经配置过密钥。

- **Windows (Git Bash) / macOS / Linux:** 输入 `ls -al ~/.ssh`
- **结果判断：** 如果看到 `id_rsa.pub` 或 `id_ed25519.pub`，说明你已经有密钥了，可以直接跳到第 3 步。如果没有，请执行第 2 步。

### 2. 生成新的 SSH Key

如果你还没有密钥，运行以下命令（记得替换成你的 GitHub 邮箱）：

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

**提示：** 之后会询问保存路径和密码（passphrase），一路按 **Enter** 键即可（留空表示不设置私钥密码）。

### 3. 将 SSH Key 添加到 GitHub

你需要把公钥告诉 GitHub，这样它才能识别你的电脑。

1. **复制公钥内容：**
   - Windows: `cat ~/.ssh/id_ed25519.pub | clip`
   - macOS: `pbcopy < ~/.ssh/id_ed25519.pub`
   - Linux: `cat ~/.ssh/id_ed25519.pub` (手动复制打印出的内容)
2. **在 GitHub 设置：**
   - 登录 GitHub，点击右上角头像 -> **Settings**。
   - 在左侧菜单点击 **SSH and GPG keys**。
   - 点击 **New SSH key**，Title 随便起（如 "My Laptop"），将复制的内容粘贴到 **Key** 框中，Key Type选择默认的Authentication Key (认证密钥) ，点击 **Add SSH key**。

### 4. 修改现有仓库的远程地址

**修改本地配置：** 在终端进入你的项目文件夹，执行：

```bash
# 查看当前地址（应该是 https://...）
git remote -v

# 修改地址为 SSH
git remote set-url origin git@github.com:用户名/仓库名.git
```

**验证修改：** 再次输入 `git remote -v`，确认地址已经变成了以 `git@github.com` 开头的格式。

### 5. 测试连接

最后，测试一下是否配置成功：

```bash
ssh -T git@github.com
```

如果看到 `Hi Username! You've successfully authenticated...`，说明一切搞定！

