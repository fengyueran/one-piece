import React from 'react'

type OverlayPopupRole = 'dialog' | 'listbox' | 'menu' | 'tree'

interface OverlayTriggerA11yProps {
  open: boolean
  controlsId: string
  popupRole: OverlayPopupRole
  disabled?: boolean
}

export const getOverlayTriggerA11yProps = ({
  open,
  controlsId,
  popupRole,
  disabled,
}: OverlayTriggerA11yProps) => ({
  'aria-expanded': open,
  'aria-controls': controlsId,
  'aria-haspopup': popupRole,
  'aria-disabled': disabled || undefined,
})

const stopOverlayEvent = (
  event: React.MouseEvent<HTMLElement> | React.PointerEvent<HTMLElement>,
) => {
  event.stopPropagation()
}

export const getOverlaySurfaceProps = () => ({
  onClick: stopOverlayEvent,
  onMouseDown: stopOverlayEvent,
  onPointerDown: stopOverlayEvent,
})
