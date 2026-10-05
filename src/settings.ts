/**
 * 快捷命令设置区:schema + 默认配置。
 *
 * 用户可配置若干"快捷命令":每个命令有名字(/name 触发)、描述,
 * 以及**选中后插入输入栏的实际提示词**。
 * 客户端(commandUi popupSelect)按此配置动态注册斜杠命令。
 *
 * 0.2.1 起:本 schema 就是设置表单(profile 条目 id `quick-commands`),
 * commands 标 `.volatile()` 成为活引用——host 半只作设置载体,客户端经
 * configForms 按条目 id 读写。
 * @module quick-commands/settings
 */

import type { Volatile } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'

export const QUICK_COMMANDS_NS = 'quick-commands'

/** 单条快捷命令:名称 + 实际提示词。 */
export interface QuickCommand {
  /** 命令名(输入栏以 /<name> 触发,小写字母/数字/连字符)。 */
  name: string
  /** 触发后插入输入栏的实际提示词。 */
  prompt: string
}

/** 设置输入面(profile patch 条目 config / 表单写入的原始值)。 */
export interface QuickCommandsInput {
  commands?: QuickCommand[]
}

/** 插件设置面:快捷命令列表(活引用)。 */
export interface QuickCommandsConfig {
  commands: Volatile<QuickCommand[]>
}

/** 命令 schema。name 不做 pattern 校验:任意文本都可保存(面板输入不因
 * 非法字符被拒);客户端注册时只注册合法命令名。 */
const commandSchema = z.object({
  name: z.string().description('命令名,输入栏以 /<name> 触发'),
  prompt: z.string().description('触发后插入输入栏的实际提示词'),
})

/** 默认配置:预置 subagent 示例(用户可在面板增删改)。 */
export const QUICK_COMMANDS_DEFAULTS: { commands: QuickCommand[] } = {
  commands: [{
    name: 'subagent',
    prompt: '使用subagent_agy_ui,model=gemini-3.7-flash-high委派任务:',
  }],
}

/** 设置表单 schema(条目 id `quick-commands`)。显式 z<S,T> 注解:数组推断类型不可移植(TS2742)。 */
export const Config: z<QuickCommandsInput, QuickCommandsConfig> = z.object({
  commands: z.array(commandSchema).default(QUICK_COMMANDS_DEFAULTS.commands)
    .description('快捷命令列表').volatile(),
})
