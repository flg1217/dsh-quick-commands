/**
 * 通用快捷命令插件 host 半:注册 quick-commands 设置区。
 *
 * 纯配置载体——不注册任何 host 命令(客户端贡献与 host 命令同名会在
 * 菜单合成时 fail-loud 抛错,行为在浏览器侧,host 无逻辑可执行)。
 * @module quick-commands
 */

import type { Context } from '@deepseek-ai/cordis'
import { installSettingsSection } from '@deepseek-ai/dsh-settings'
import {
  QUICK_COMMANDS_NS, QuickCommandsConfigSchema, QUICK_COMMANDS_DEFAULTS,
} from './settings.js'
import type { QuickCommandsConfig } from './settings.js'

export const name = 'quick-commands'

/** 当前配置读取(客户端/其它 host 插件可用)。 */
export function quickCommandsConfig(ctx: Context): QuickCommandsConfig {
  const scope = ctx.get('settings') as { get?: (ns: string) => QuickCommandsConfig | undefined } | undefined
  return scope?.get?.('quick-commands') ?? QUICK_COMMANDS_DEFAULTS
}

export function apply(ctx: Context): void {
  installSettingsSection(ctx, QUICK_COMMANDS_NS, QuickCommandsConfigSchema, QUICK_COMMANDS_DEFAULTS, {
    setSource: () => {},
    onChange: () => {},
  })
}

export { QUICK_COMMANDS_NS, QuickCommandsConfigSchema, QUICK_COMMANDS_DEFAULTS }
export type { QuickCommandsConfig, QuickCommand } from './settings.js'
