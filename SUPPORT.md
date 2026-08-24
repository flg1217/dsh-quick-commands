# 支持

## 获取帮助

- 阅读 [README](README.md) 与 [README.en.md](README.en.md)
- 搜索仓库 [Issues](https://github.com/flg1217/dsh-quick-commands/issues) 是否已有相同问题
- 排查步骤:
  1. `dsh plugin --profile web add <本仓库目录>` 确认装配
  2. 重启 dsh web
  3. 设置 → 插件 → 快捷命令,添加命令并确认保存
  4. 输入栏输入 `/` 确认菜单中出现该命令

## 常见问题

### 输入 `/` 后菜单里没有我的命令

确认命令已保存(`~/.dsh/settings.yaml` 应有 `quick-commands` 段)。若已保存仍不出现,强制刷新页面(Ctrl+Shift+R)清除旧 bundle 缓存。

### 发送时报 `no serializer for reference source`

通常是浏览器缓存了旧版本 bundle。强制刷新后重试。

### 配置丢失

配置持久化在 `~/.dsh/settings.yaml` 的 `quick-commands` 段。删除该段或手动改动后,请重启 dsh 服务。

## 问题反馈

请通过 [Issues](https://github.com/flg1217/dsh-quick-commands/issues) 提交问题,并附上:
- dsh 版本与 profile
- 插件版本
- 复现步骤与相关日志/截图
