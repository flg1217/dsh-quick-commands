/**
 * 通用快捷命令插件 host 半:注册 quick-commands 设置区。
 *
 * 纯配置载体——不注册任何 host 命令(客户端贡献与 host 命令同名会在
 * 菜单合成时 fail-loud 抛错,行为在浏览器侧,host 无逻辑可执行)。
 * @module quick-commands
 */
import { QUICK_COMMANDS_NS, QuickCommandsConfigSchema, QUICK_COMMANDS_DEFAULTS, } from './settings.js';
export const name = 'quick-commands';
/** 当前配置读取(客户端/其它 host 插件可用)。 */
export function quickCommandsConfig(ctx) {
    const scope = ctx.get('settings');
    return scope?.get?.('quick-commands') ?? QUICK_COMMANDS_DEFAULTS;
}
export function apply(ctx) {
    // 官方 0.1.2:设置区经 ctx.settings.installSection 注册。
    ctx.inject(['settings'], (settingsCtx) => {
        const settings = settingsCtx.get('settings');
        settings?.installSection?.(ctx, QUICK_COMMANDS_NS, QuickCommandsConfigSchema, QUICK_COMMANDS_DEFAULTS, {
            setSource: () => { },
            onChange: () => { },
        });
    });
}
export { QUICK_COMMANDS_NS, QuickCommandsConfigSchema, QUICK_COMMANDS_DEFAULTS };
