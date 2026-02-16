"use client"

import * as React from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import AddHotelForm from "../add-new-hotel/AddHotelForm"

type AddHotelDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: () => void
}

const AddHotelDialog = ({ open, onOpenChange, onCreated }: AddHotelDialogProps) => {
  const handleCreated = React.useCallback(() => {
    onCreated?.()
    onOpenChange(false)
  }, [onCreated, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Hotel</DialogTitle>
          <DialogDescription>
            Fill in hotel details and create a new hotel record.
          </DialogDescription>
        </DialogHeader>
        <AddHotelForm
          onCreated={handleCreated}
          onCancel={() => onOpenChange(false)}
          showCancelButton
        />
      </DialogContent>
    </Dialog>
  )
}

export default AddHotelDialog
