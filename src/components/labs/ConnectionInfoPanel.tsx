'use client'

import { useState } from 'react'
import { GlobeAltIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline'

interface ConnectionInfoPanelProps {
  instanceId: string
  enginePort?: number | null
}

export default function ConnectionInfoPanel({ instanceId, enginePort }: ConnectionInfoPanelProps) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const host = process.env.NEXT_PUBLIC_ENGINE_HOST || 'localhost'
  const port = enginePort || 9100

  const connectionInfo = {
    ssh: `ssh simuser@${host} -p ${port}`,
    ansible: `ansible-inventory -i ${host}, --user simuser --key-file ~/.ssh/sim_${instanceId.slice(0, 8)}`,
    terraform: `provider "simulation" {\n  host     = "${host}"\n  port     = ${port}\n  api_key  = var.sim_api_key\n}`,
    api: `curl -H "Authorization: Bearer <api-key>" http://${host}:${port}/api/v1/`,
  }

  function handleCopy(text: string, label: string) {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  const copyButton = (label: string) => (
    <button
      onClick={() => handleCopy(label, label)}
      className="p-1 rounded hover:bg-slate-700 text-slate-500 hover:text-cyan-300 transition-colors shrink-0"
      title="Copy to clipboard"
    >
      {copied === label ? (
        <span className="text-[10px] text-cyan-400 font-medium">Copied!</span>
      ) : (
        <ClipboardDocumentIcon className="h-3 w-3" />
      )}
    </button>
  )

  return (
    <div className="border-t border-slate-800">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
      >
        <div className="flex items-center gap-1.5">
          <GlobeAltIcon className="h-3.5 w-3.5" />
          <span>Connection Info</span>
        </div>
        <span className="text-slate-600">{expanded ? '▾' : '▸'}</span>
      </button>

      {expanded && (
        <div className="px-4 pb-3 space-y-3">
          {/* SSH */}
          <div>
            <p className="text-[10px] text-slate-500 font-medium mb-1 uppercase tracking-wider">SSH</p>
            <div className="flex items-center gap-1">
              <code className="flex-1 text-xs text-slate-300 font-mono bg-slate-900 px-2 py-1 rounded truncate">
                {connectionInfo.ssh}
              </code>
              {copyButton(connectionInfo.ssh)}
            </div>
          </div>

          {/* Ansible */}
          <div>
            <p className="text-[10px] text-slate-500 font-medium mb-1 uppercase tracking-wider">Ansible</p>
            <div className="flex items-center gap-1">
              <code className="flex-1 text-xs text-slate-300 font-mono bg-slate-900 px-2 py-1 rounded truncate">
                {connectionInfo.ansible}
              </code>
              {copyButton(connectionInfo.ansible)}
            </div>
          </div>

          {/* Terraform */}
          <div>
            <p className="text-[10px] text-slate-500 font-medium mb-1 uppercase tracking-wider">Terraform</p>
            <div className="flex items-center gap-1">
              <pre className="flex-1 text-xs text-slate-300 font-mono bg-slate-900 px-2 py-1 rounded overflow-x-auto whitespace-pre">
                {connectionInfo.terraform}
              </pre>
              {copyButton(connectionInfo.terraform)}
            </div>
          </div>

          {/* REST API */}
          <div>
            <p className="text-[10px] text-slate-500 font-medium mb-1 uppercase tracking-wider">REST API</p>
            <div className="flex items-center gap-1">
              <code className="flex-1 text-xs text-slate-300 font-mono bg-slate-900 px-2 py-1 rounded truncate">
                {connectionInfo.api}
              </code>
              {copyButton(connectionInfo.api)}
            </div>
          </div>

          <p className="text-[10px] text-slate-600 mt-2">
            Generate an API key in the panel above and use it with these connection strings.
          </p>
        </div>
      )}
    </div>
  )
}
