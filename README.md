# dsh-quick-commands

> **用户自定义斜杠命令 — DeepSeek Harness 的快捷指令增强**
> 在设置面板配置自己的快捷命令与提示词:输入栏输入 `/名称`,选中后以占位符(chip)形式进入输入栏,发送时自动展开为完整提示词。零源码改动,开箱即用。

## 一、这是什么

**dsh-quick-commands** 是面向 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)(dsh) 的开源插件,让你把高频使用的指令沉淀为一条条斜杠命令:

| 能力 | 说明 |
| --- | --- |
| **自定义斜杠命令** | 在设置 → 插件 → 快捷命令 中自由增删命令,每条命令 = 名称 + 提示词 |
| **占位符(chip)输入** | 输入栏输入 `/名称` 并选中后,命令以 chip 占位符呈现(不是整段文字),发送时才展开为完整提示词,草稿区干净可读 |
| **实时生效** | 配置保存后立即生效(无需重启);设置变更实时同步,拼音输入不被中断 |
| **持久化** | 配置写入 dsh settings 文档,重启不丢失 |

插件严格遵循 dsh 官方扩展机制(profile bundle patch / settings namespace / 客户端 input-trigger source),**不修改 dsh 任何源码**,可随 dsh 平滑升级。

## 二、核心功能

### 1. 自定义斜杠命令

在设置 → 插件 → 快捷命令 卡片中管理命令列表:

- **命令名**:输入栏以 `/名称` 触发(例如 `subagent` → `/subagent`)
- **提示词**:选中命令后,发送时展开为完整提示词的文本

示例:配置命令 `subagent`、提示词 `使用subagent_agy_ui,model=gemini-3.7-flash-high委派任务:`,之后输入 `/subagent` 并回车,发送内容即为该完整提示词。

### 2. 占位符(chip)输入体验

选中命令后,输入栏显示 `/subagent` chip(占位符),而不是直接塞入一大段文字:

- 草稿区保持简洁,可继续编辑其他内容
- 发送时自动展开为完整提示词
- 支持复制/持久化投影为 `/subagent` 文本

### 3. 实时生效与持久化

- 保存(400ms 防抖自动保存)后命令立即出现在输入栏 `/` 菜单,无需重启
- 配置写入 `settings.yaml`,重启后保留
- 外部编辑(如直接改配置文件)后,设置面板自动重载

## 三、快速开始

### 安装

```bash
# 1. 克隆仓库
git clone https://github.com/flg1217/dsh-quick-commands.git
cd dsh-quick-commands

# 2. 安装依赖并构建
pnpm install
pnpm build

# 3. 挂载到 dsh profile(以 web profile 为例)
dsh plugin --profile web add <本仓库目录>
# 或手动在 profile 的 package.json dependencies 添加:
#   "@flg1217/dsh-quick-commands": "link:<本仓库绝对路径>"
# 然后在该 profile 目录执行 pnpm install
```

### 使用

1. 打开 dsh web(如 `http://127.0.0.1:3080`)
2. 进入 **设置 → 插件 → 快捷命令**
3. 添加命令:填写命令名与提示词(如 `subagent` / `使用subagent_agy_ui,model=gemini-3.7-flash-high委派任务:`)
4. 在对话输入栏输入 `/` ,选中你的命令,回车发送

### 卸载

```bash
dsh plugin --profile web remove dsh-quick-commands
# 或从 profile 的 package.json 移除依赖并 pnpm install
# 同时删除 ~/.dsh/settings.yaml 中的 quick-commands 配置段(可选)
```

## 四、配置

配置位于 **设置 → 插件 → 快捷命令**,对应 settings namespace `quick-commands`:

| 配置项 | 类型 | 说明 |
| --- | --- | --- |
| `commands[].name` | string | 命令名,输入栏以 `/名称` 触发 |
| `commands[].prompt` | string | 选中命令后,发送时展开为完整提示词的文本 |

也可直接编辑 `~/.dsh/settings.yaml`:

```yaml
quick-commands:
  commands:
    - name: subagent
      prompt: 使用subagent_agy_ui,model=gemini-3.7-flash-high委派任务:
```

## 五、权限与数据

- **配置数据**:仅读写 dsh settings 文档(`quick-commands` namespace),不落盘其他文件
- **网络**:无任何网络请求
- **凭据**:不存储、不读取任何密钥或凭据
- **本地执行**:不 spawn 任何外部进程

## 六、常见问题

### 输入 `/` 后菜单里没有我的命令

确认命令已保存(设置面板有防抖 400ms 自动保存;保存后 `settings.yaml` 应出现 `quick-commands` 段)。若确认已保存仍不出现,刷新页面(浏览器缓存旧 bundle)。

### 发送时报 `no serializer for reference source`

通常是浏览器缓存了旧版本 bundle。强制刷新页面(如 Ctrl+Shift+R)后重试。

### 配置丢失

配置持久化在 `~/.dsh/settings.yaml` 的 `quick-commands` 段。若删除该段或手动改动后未重启,请重启 dsh 服务。

## 七、开发

```bash
pnpm install
pnpm build     # tsc 编译服务端 + 拷贝客户端 bundle
pnpm typecheck # 类型检查
pnpm test      # 运行测试(vitest)
```

结构:

```
src/
├─ index.ts          # 服务端:settings namespace 注册
├─ settings.ts       # schema + 默认配置
└─ client/index.js   # 浏览器半:input-trigger source + 设置面板卡片
```

## 八、许可与安全

- **许可证**:MIT(见 [LICENSE](LICENSE))
- **安全**:安全问题请勿公开提交 issue,通过仓库页面联系维护者(见 [SECURITY.md](SECURITY.md))
