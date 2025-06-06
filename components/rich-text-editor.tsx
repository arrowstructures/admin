"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Bold, Italic, List, ListOrdered, Link, Quote, Heading1, Heading2 } from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}

export function RichTextEditor({ value, onChange, placeholder, rows = 10 }: RichTextEditorProps) {
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(null)

  const insertText = (before: string, after = "") => {
    if (!textareaRef) return

    const start = textareaRef.selectionStart
    const end = textareaRef.selectionEnd
    const selectedText = value.substring(start, end)
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)

    onChange(newText)

    // Set cursor position after insertion
    setTimeout(() => {
      textareaRef.focus()
      textareaRef.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }

  const formatButtons = [
    { icon: Bold, action: () => insertText("**", "**"), tooltip: "Bold" },
    { icon: Italic, action: () => insertText("*", "*"), tooltip: "Italic" },
    { icon: Heading1, action: () => insertText("# "), tooltip: "Heading 1" },
    { icon: Heading2, action: () => insertText("## "), tooltip: "Heading 2" },
    { icon: List, action: () => insertText("- "), tooltip: "Bullet List" },
    { icon: ListOrdered, action: () => insertText("1. "), tooltip: "Numbered List" },
    { icon: Quote, action: () => insertText("> "), tooltip: "Quote" },
    { icon: Link, action: () => insertText("[", "](url)"), tooltip: "Link" },
  ]

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 p-2 border rounded-md bg-muted/50">
        {formatButtons.map((button, index) => (
          <Button
            key={index}
            type="button"
            variant="ghost"
            size="sm"
            onClick={button.action}
            title={button.tooltip}
            className="h-8 w-8 p-0"
          >
            <button.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>
      <Textarea
        ref={setTextareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="font-mono text-sm"
      />
      <div className="text-xs text-muted-foreground">
        Supports Markdown formatting. Use the buttons above for quick formatting.
      </div>
    </div>
  )
}
