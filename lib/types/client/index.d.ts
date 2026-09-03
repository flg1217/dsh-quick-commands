// 快捷命令插件浏览器半:
//   1. 注册一个 '/' InputTriggerSource:输入 /<命令名> 时菜单列出配置的命令,
//      选中后把该命令的提示词直接替换进输入栏(无二级弹窗);
//   2. settings.plugin.item 设置卡:增删命令(名称/提示词),变更即写。
// 候选每次实时读配置,新增/修改命令即时生效,无需重注册。
window.__ModuleLoader__.load({
  id: '@flg1217/dsh-quick-commands',
  factory: (require) => {
    const module = { exports: {} }
    const exports = module.exports
    const react = require('react')
    const slots = require('@deepseek-ai/dsh-client-ui-slots')
    const P = require('@deepseek-ai/dsh-client-ui-primitives')
    const { Button, IconChevronDownOutline14, IconPlusOutline16 } = P

    // prompt 预览:单行截断,过长省略号。
    const PROMPT_PREVIEW_MAX = 60
    const promptPreview = (prompt) => {
      if (typeof prompt !== 'string') return ''
      const flat = prompt.replace(/\s+/g, ' ').trim()
      if (flat.length <= PROMPT_PREVIEW_MAX) return flat
      return flat.slice(0, PROMPT_PREVIEW_MAX - 1) + '…'
    }

    const NS = 'quick-commands'

    // ── 设置卡 CSS(复用官方 PluginCard 视觉) ──
    const CSS = {
      card: '.dshQc_card{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);border-radius:12px;list-style:none;transition:border-color .16s,background .16s}',
      cardHover: '.dshQc_card:hover{border-color:var(--dsw-alias-label-dimmed)}',
      cardOpen: '.dshQc_cardOpen{background:var(--dsw-alias-bg-layer-2);border-color:var(--dsw-alias-label-dimmed)}',
      header: '.dshQc_header{appearance:none;width:100%;font:inherit;color:inherit;text-align:left;cursor:pointer;background:0 0;border:0;border-radius:12px;align-items:center;gap:12px;padding:14px 16px;display:flex}',
      headerFocus: '.dshQc_header:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:-2px}',
      headText: '.dshQc_headText{flex-direction:column;flex:1;gap:4px;min-width:0;display:flex}',
      name: '.dshQc_name{color:var(--dsw-alias-label-primary);font-size:15px;font-weight:600;line-height:1.4}',
      description: '.dshQc_description{color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:1.5}',
      chevron: '.dshQc_chevron{color:var(--dsw-alias-label-tertiary);flex:none;transition:transform .16s}',
      chevronOpen: '.dshQc_chevronOpen{transform:rotate(180deg)}',
      body: '.dshQc_body{border-top:1px solid var(--dsw-alias-border-l2);margin:0 16px;padding:14px 0;display:flex;flex-direction:column;gap:12px}',
      cmd: '.dshQc_cmd{border:1px solid var(--dsw-alias-border-l2);border-radius:10px;padding:14px 16px;background:var(--dsw-alias-bg-layer-3);display:flex;flex-direction:column;gap:10px}',
      cmdTitle: '.dshQc_cmdTitle{display:flex;align-items:center;gap:8px}',
      cmdSlug: '.dshQc_cmdSlug{color:var(--dsw-alias-label-tertiary);font-size:14px;font-weight:600;flex:none}',
      inputFull: '.dshQc_inputFull{width:100%;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-primary);border-radius:6px;padding:7px 10px;font:inherit;font-size:13px}',
      promptArea: '.dshQc_promptArea{width:100%;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-primary);border-radius:6px;padding:7px 10px;font:inherit;font-size:12px;font-family:ui-monospace,monospace;line-height:1.5;resize:vertical;min-height:60px}',
      btn: '.dshQc_btn{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-secondary);border-radius:6px;padding:5px 12px;font:inherit;font-size:12px;cursor:pointer;white-space:nowrap}',
      btnDanger: '.dshQc_btnDanger{border:1px solid var(--dsw-alias-border-l2);background:0 0;color:var(--dsw-alias-label-tertiary);border-radius:6px;padding:3px 8px;font:inherit;font-size:12px;cursor:pointer;white-space:nowrap;flex:none}',
      hint: '.dshQc_hint{color:var(--dsw-alias-label-tertiary);margin:0;font-size:12px;line-height:1.5}',
      addRow: '.dshQc_addRow{display:flex;gap:8px;align-items:center;margin-top:4px;padding-top:12px;border-top:1px dashed var(--dsw-alias-border-l2)}',
      empty: '.dshQc_empty{color:var(--dsw-alias-label-tertiary);font-size:13px;text-align:center;padding:8px 0}',
    }
    const cssText = Object.values(CSS).join('')
    const tagId = '@flg1217/quick-commands/card.css'
    if (typeof document !== 'undefined' && document.querySelector(`style[data-plugin-css=${JSON.stringify(tagId)}]`) === null) {
      const tag = document.createElement('style')
      tag.dataset.plugin = '@flg1217/dsh-quick-commands'
      tag.dataset.pluginCss = tagId
      tag.textContent = cssText
      document.head.appendChild(tag)
    }
    const C = {
      card: 'dshQc_card', cardOpen: 'dshQc_cardOpen', header: 'dshQc_header',
      headText: 'dshQc_headText', name: 'dshQc_name', description: 'dshQc_description',
      chevron: 'dshQc_chevron', chevronOpen: 'dshQc_chevronOpen', body: 'dshQc_body',
      cmd: 'dshQc_cmd', cmdTitle: 'dshQc_cmdTitle', cmdSlug: 'dshQc_cmdSlug',
      inputFull: 'dshQc_inputFull', promptArea: 'dshQc_promptArea',
      btn: 'dshQc_btn', btnDanger: 'dshQc_btnDanger',
      hint: 'dshQc_hint', addRow: 'dshQc_addRow', empty: 'dshQc_empty',
    }

    // ── 设置卡:命令编辑器(每组一个命令:名称 + 提示词) ──
    function QuickCommandsCard(props) {
      const scope = props.scope
      const [open, setOpen] = react.useState(false)
      const [draft, setDraft] = react.useState([])
      const [loaded, setLoaded] = react.useState(false)
      const [writeError, setWriteError] = react.useState('')

      // 本地编辑守卫:draftRef 跟踪最新草稿,savedRef 记录最近一次服务器
      // 确认值。远程重载只在"本地没有未保存修改"时应用——否则(IME 组合
      // 输入中/防抖窗口内继续击键)覆盖 draft 会打断输入、吞掉字符。
      const draftRef = react.useRef([])
      const savedRef = react.useRef(null)
      const hasEditsRef = react.useRef(false)

      const load = react.useCallback(() => {
        try {
          const commands = scope.getSnapshot().value?.commands
          if (Array.isArray(commands)) {
            const json = JSON.stringify(commands)
            savedRef.current = json
            if (!hasEditsRef.current || JSON.stringify(draftRef.current) === savedRef.current) {
              draftRef.current = commands
              setDraft(commands)
            }
          }
        } catch { /* 镜像未就绪保持现状 */ }
        setLoaded(true)
      }, [scope])

      react.useEffect(() => { load() }, [load])

      // 实时刷新:设置文档变更(本卡保存或外部编辑)后重载,参照官方
      // ui-agent-preset 的 settings/document-updated 监听模式。
      react.useEffect(() => scope.subscribe(() => load()), [scope, load])

      // 保存:整段替换 commands(mutate 的 path 必须是数组分段路径)。
      // 防抖 400ms,避免连续击键时多次全量 mutate 的竞态(乱序覆盖)。
      const saveTimer = react.useRef(null)
      const save = react.useCallback((next) => {
        hasEditsRef.current = true
        draftRef.current = next
        setDraft(next)
        setWriteError('')
        if (saveTimer.current !== null) clearTimeout(saveTimer.current)
        saveTimer.current = setTimeout(async () => {
          try {
            // 官方 0.1.2:SettingsScope.set 队列原子写。
            await scope.set('commands', next)
            savedRef.current = JSON.stringify(next)
            // mutate 期间用户没有继续输入才解除编辑态。
            if (JSON.stringify(draftRef.current) === savedRef.current) hasEditsRef.current = false
          } catch (e) {
            setWriteError(String(e))
          }
        }, 400)
      }, [remote])
      react.useEffect(() => () => {
        if (saveTimer.current !== null) clearTimeout(saveTimer.current)
      }, [])

      const addCommand = () => {
        save([...draft, { name: '', prompt: '' }])
      }
      const removeCommand = (ci) => {
        save(draft.filter((_, i) => i !== ci))
      }
      const patchCommand = (ci, patch) => {
        save(draft.map((c, i) => (i === ci ? { ...c, ...patch } : c)))
      }

      return react.createElement('li', { className: `${C.card} ${open ? C.cardOpen : ''}` },
        react.createElement('button', {
          type: 'button', className: C.header, 'aria-expanded': open,
          'aria-label': `${open ? '收起' : '展开'}: 快捷命令`,
          onClick: () => setOpen(!open),
        },
          react.createElement('span', { className: C.headText },
            react.createElement('span', { className: C.name }, '快捷命令'),
            react.createElement('span', { className: C.description },
              loaded ? `配置斜杠命令(当前 ${draft.length} 个),/名称 把提示词填入输入栏` : '加载中...'),
          ),
          react.createElement(IconChevronDownOutline14, { className: `${C.chevron} ${open ? C.chevronOpen : ''}` }),
        ),
        open && react.createElement('div', { className: C.body },
          react.createElement('p', { className: C.hint },
            '每个命令对应一段提示词:输入栏输入 /名称 选中后,该提示词直接填入输入栏。'),
          draft.length === 0
            ? react.createElement('p', { className: C.empty }, '尚未配置命令——点击下方添加第一个命令。')
            : draft.map((cmd, ci) =>
                react.createElement('div', { key: ci, className: C.cmd },
                  // 命令标题:name + 删除
                  react.createElement('div', { className: C.cmdTitle },
                    react.createElement('span', { className: C.cmdSlug }, '/'),
                    react.createElement('input', {
                      className: C.inputFull, value: cmd.name, placeholder: '命令名,如 subagent',
                      style: { fontWeight: 600 },
                      onChange: (e) => patchCommand(ci, { name: e.target.value }),
                    }),
                    react.createElement('button', {
                      type: 'button', className: C.btnDanger, onClick: () => removeCommand(ci),
                      title: '删除该命令',
                    }, '✕'),
                  ),
                  // 实际提示词
                  react.createElement('textarea', {
                    className: C.promptArea, value: cmd.prompt, rows: 3,
                    placeholder: '选中后填入输入栏的实际提示词',
                    onChange: (e) => patchCommand(ci, { prompt: e.target.value }),
                  }),
                ),
              ),
          react.createElement('div', { className: C.addRow },
            react.createElement(Button, { size: 'md', onClick: addCommand, icon: react.createElement(IconPlusOutline16, { size: 14 }) }, '添加命令'),
            writeError !== '' && react.createElement('span', { className: C.hint }, `保存失败:${writeError}`),
          ),
        ),
      )
    }

    // ── 插件主体:InputTriggerSource 注册 + 设置卡 ──
    function apply(ctx) {
      ctx.inject(['inputTriggers', 'slots', 'settingsScope'], (scope) => {
        const inputTriggers = scope.get('inputTriggers')
        const cmdScope = scope.get('settingsScope').bind({ namespace: NS })
        const remote = scope.get('remote')

        const readCommands = async () => {
          try {
            const commands = cmdScope.getSnapshot().value?.commands
            return Array.isArray(commands) ? commands : []
          } catch {
            return []
          }
        }

        const source = {
          trigger: '/',
          name: 'quick-commands',
          order: 1,
          // 输入 / 时菜单列出配置的命令,描述显示 prompt 预览(过长截断)。
          async candidates(_session, { query, signal }) {
            const commands = await readCommands()
            if (signal.aborted) return []
            return commands
              .filter(cmd => typeof cmd?.name === 'string' && cmd.name.length > 0)
              .filter(cmd => cmd.name.startsWith(query))
              .map(cmd => ({
                name: cmd.name,
                description: promptPreview(cmd.prompt),
                // 携带 ref:与 /name 同义,供 insert 与 codec 定位。
                value: cmd.name,
              }))
          },
          onPick({ candidate }) {
            // ReferenceInsert:输入栏以 chip(占位符)呈现 /name,
            // 提交时才由 codec.serialize 展开为完整提示词。
            return {
              insert: {
                source: 'quick-commands',
                ref: candidate.value,
                label: `/${candidate.name}`,
                appearance: 'file',
                clipboardText: `/${candidate.name}`,
              },
            }
          },
          codec: {
            clipboardText: ref => `/${ref}`,
            serialize: async (ref) => {
              const commands = await readCommands()
              const cmd = commands.find(c => c.name === ref)
              return (cmd !== undefined && typeof cmd.prompt === 'string' && cmd.prompt.length > 0)
                ? cmd.prompt
                : `/${ref}`
            },
          },
        }

        scope.effect(() => {
          const unregister = inputTriggers.registerSource(source)
          return () => { unregister() }
        }, 'quick-commands: input trigger source')

        scope.effect(() => {
          const sectionInject = () => ({ scope: cmdScope })
          return scope.slots.inject('settings.plugin.item', () => {
            return scope.slots.register({
              name: 'settings.plugin.item',
              id: 'quick-commands',
              key: 'quick-commands',
              order: 40,
              label: () => '快捷命令',
              inject: sectionInject,
            }, QuickCommandsCard)
          })
        }, 'quick-commands: settings.plugin.item')
      })
    }

    exports.apply = apply
    exports.inject = ['inputTriggers', 'slots', 'settingsScope']
    exports.name = 'quick-commands-client'
    return module.exports
  },
})
