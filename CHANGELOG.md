# Changelog

本项目遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 与 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

## [0.1.0] - 2026-08-21

### 新增

- **自定义斜杠命令**:设置 → 插件 → 快捷命令 中配置命令(名称 + 提示词),输入栏 `/名称` 触发
- **占位符(chip)输入**:选中命令后以 chip 呈现,发送时由 `codec.serialize` 展开为完整提示词
- **输入触发器(source)**:注册 `quick-commands` 的 `/` input-trigger source,候选实时读配置
- **实时生效**:配置保存(400ms 防抖)后立即出现在 `/` 菜单,无需重启
- **持久化**:配置写入 dsh settings 文档(`quick-commands` namespace),重启保留
- **IME 安全**:本地编辑守卫防止远程重载覆盖正在输入(拼音)的草稿
- **设置面板卡片**:命令增删、名称/提示词编辑,复用官方 PluginCard 视觉
