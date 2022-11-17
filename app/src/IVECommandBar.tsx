import "./vercel.scss"
import { Command } from 'cmdk'
import React, { KeyboardEvent } from 'react'

export const IVECommandBar = () => {
  const [open, setOpen] = React.useState(true)

  // Toggle the menu when ⌘K is pressed
  React.useEffect(() => {
    const down = (ev: Event) => {
      const unknowne = ev as unknown;
      const e: KeyboardEvent = unknowne as KeyboardEvent;
      if (e.key === 'k' && e.metaKey) {
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
      <Command.Dialog open={open} onOpenChange={setOpen} label="Global Command Menu">
    <div className="vercel">
        <Command.Input placeholder="This is where you enter stuff..." />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>

          <Command.Group heading="Letters">
            <Command.Item>a</Command.Item>
            <Command.Item>b</Command.Item>
            <Command.Separator />
            <Command.Item>c</Command.Item>
          </Command.Group>

          <Command.Item>Apple</Command.Item>
        </Command.List>
        </div>
      </Command.Dialog>
  )
}
