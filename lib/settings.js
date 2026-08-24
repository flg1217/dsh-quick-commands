/**
 * 快捷命令设置区:schema + 默认配置。
 *
 * 用户可配置若干"快捷命令":每个命令有名字(/name 触发)、描述,
 * 以及**选中后插入输入栏的实际提示词**。
 * 客户端(commandUi popupSelect)按此配置动态注册斜杠命令。
 * @module quick-commands/settings
 */
import z from '@deepseek-ai/schemastery';
import { settingsNamespace } from '@deepseek-ai/dsh-settings';
export const QUICK_COMMANDS_NS = settingsNamespace('quick-commands');
/** 命令 schema。name 不做 pattern 校验:任意文本都可保存(面板输入不因
 * 非法字符被拒);客户端注册时只注册合法命令名。 */
const commandSchema = z.object({
    name: z.string().description('命令名,输入栏以 /<name> 触发'),
    prompt: z.string().description('触发后插入输入栏的实际提示词'),
});
/** 设置表单 schema。 */
export const QuickCommandsConfigSchema = z.object({
    commands: z.array(commandSchema).default([]).description('快捷命令列表'),
});
/** 默认配置:预置 subagent 示例(用户可在面板增删改)。 */
export const QUICK_COMMANDS_DEFAULTS = {
    commands: [{
            name: 'subagent',
            prompt: '使用subagent_agy_ui,model=gemini-3.7-flash-high委派任务:',
        }],
};
