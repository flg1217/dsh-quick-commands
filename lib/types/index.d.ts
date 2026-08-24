/**
 * 通用快捷命令插件 host 半:注册 quick-commands 设置区。
 *
 * 纯配置载体——不注册任何 host 命令(客户端贡献与 host 命令同名会在
 * 菜单合成时 fail-loud 抛错,行为在浏览器侧,host 无逻辑可执行)。
 * @module quick-commands
 */
import type { Context } from '@deepseek-ai/cordis';
import { QUICK_COMMANDS_NS, QuickCommandsConfigSchema, QUICK_COMMANDS_DEFAULTS } from './settings.js';
import type { QuickCommandsConfig } from './settings.js';
export declare const name = "quick-commands";
/** 当前配置读取(客户端/其它 host 插件可用)。 */
export declare function quickCommandsConfig(ctx: Context): QuickCommandsConfig;
export declare function apply(ctx: Context): void;
export { QUICK_COMMANDS_NS, QuickCommandsConfigSchema, QUICK_COMMANDS_DEFAULTS };
export type { QuickCommandsConfig, QuickCommand } from './settings.js';
