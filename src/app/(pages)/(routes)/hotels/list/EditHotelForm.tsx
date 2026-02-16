"use client"

import * as React from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Hotel } from "@/store/useHotelStore"
import AddHotelForm, { HotelFormValues } from "../add-new-hotel/AddHotelForm"

type EditHotelFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialHotel: Hotel | null
  onUpdated?: () => void
}

const EditHotelForm = ({
  open,
  onOpenChange,
  initialHotel,
  onUpdated,
}: EditHotelFormProps) => {
  const isOpen = open && Boolean(initialHotel)

  const initialValues = React.useMemo(
    () => ({
      name: initialHotel?.name ?? "",
      description: initialHotel?.description ?? "",
      location: initialHotel?.location ?? "",
      address: initialHotel?.address ?? "",
      rating: Number.isFinite(initialHotel?.rating)
        ? Number(initialHotel?.rating)
        : 0,
      pricePerNight: Number.isFinite(initialHotel?.pricePerNight)
        ? Number(initialHotel?.pricePerNight)
        : 0,
    }),
    [initialHotel]
  )

  const onSubmit = React.useCallback(async (values: HotelFormValues) => {
    if (!initialHotel?.id) return

    const response = await fetch("/api/hotels", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: initialHotel.id,
        name: values.name,
        description: values.description,
        location: values.location,
        address: values.address,
        rating: values.rating || 0,
        pricePerNight: values.pricePerNight,
        photos: Array.isArray(initialHotel.photos) ? initialHotel.photos : [],
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to update hotel")
    }

    if (onUpdated) {
      await onUpdated()
    }
    onOpenChange(false)
  }, [initialHotel, onOpenChange, onUpdated])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Hotel</DialogTitle>
          <DialogDescription>
            Update the hotel details and save your changes.
          </DialogDescription>
        </DialogHeader>
        <AddHotelForm
          key={initialHotel?.id ?? "edit-empty"}
          initialValues={initialValues}
          onSubmitValues={onSubmit}
          onCancel={() => onOpenChange(false)}
          showCancelButton
          submitLabel="Save Changes"
          submittingLabel="Saving..."
          resetOnSuccess={false}
        />
      </DialogContent>
    </Dialog>
  )
}

export default EditHotelForm
