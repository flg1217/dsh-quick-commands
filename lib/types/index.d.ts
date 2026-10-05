/**
 * 通用快捷命令插件 host 半:设置载体(quick-commands 设置表单)。
 *
 * 纯配置载体——不注册任何 host 命令(客户端贡献与 host 命令同名会在
 * 菜单合成时 fail-loud 抛错,行为在浏览器侧,host 无逻辑可执行)。
 * 0.2.1 起 schema 即设置表单(见 settings.ts 的 Config),host 只需注册
 * "自带页面"策略(替代旧 installSection)。
 * @module quick-commands
 */
import type { Context } from '@deepseek-ai/cordis';
export declare const name = "quick-commands";
export declare function apply(ctx: Context): void;
export { QUICK_COMMANDS_NS, Config, QUICK_COMMANDS_DEFAULTS, } from './settings.js';
export type { QuickCommandsConfig, QuickCommandsInput, QuickCommand } from './settings.js';
