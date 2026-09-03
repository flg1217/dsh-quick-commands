/**
 * 快捷命令设置区:schema + 默认配置。
 *
 * 用户可配置若干"快捷命令":每个命令有名字(/name 触发)、描述,
 * 以及**选中后插入输入栏的实际提示词**。
 * 客户端(commandUi popupSelect)按此配置动态注册斜杠命令。
 * @module quick-commands/settings
 */
import z from '@deepseek-ai/schemastery';
export declare const QUICK_COMMANDS_NS = "quick-commands";
/** 单条快捷命令:名称 + 实际提示词。 */
export interface QuickCommand {
    /** 命令名(输入栏以 /<name> 触发,小写字母/数字/连字符)。 */
    name: string;
    /** 触发后插入输入栏的实际提示词。 */
    prompt: string;
}
/** 插件设置:快捷命令列表。 */
export interface QuickCommandsConfig {
    commands: QuickCommand[];
}
/** 设置表单 schema。 */
export declare const QuickCommandsConfigSchema: z<QuickCommandsConfig>;
/** 默认配置:预置 subagent 示例(用户可在面板增删改)。 */
export declare const QUICK_COMMANDS_DEFAULTS: QuickCommandsConfig;
