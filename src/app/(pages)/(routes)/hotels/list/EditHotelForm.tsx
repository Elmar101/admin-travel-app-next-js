"use client"

import * as React from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Hotel } from "@/store/useHotelStore"

const hotelFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().optional(),
  location: z.string().min(2, { message: "Location is required." }),
  address: z
    .string()
    .min(5, { message: "Address is required and must be at least 5 characters." }),
  rating: z.coerce.number().min(0).max(5).optional(),
  pricePerNight: z.coerce
    .number()
    .min(0, { message: "Price must be a positive number." }),
})

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
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<z.infer<typeof hotelFormSchema>>({
    resolver: zodResolver(hotelFormSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      address: "",
      rating: 0,
      pricePerNight: 0,
    },
  })

  React.useEffect(() => {
    if (!initialHotel) return

    form.reset({
      name: initialHotel.name ?? "",
      description: initialHotel.description ?? "",
      location: initialHotel.location ?? "",
      address: initialHotel.address ?? "",
      rating: Number.isFinite(initialHotel.rating) ? initialHotel.rating : 0,
      pricePerNight: Number.isFinite(initialHotel.pricePerNight)
        ? initialHotel.pricePerNight
        : 0,
    })
  }, [initialHotel, form])

  const onSubmit = async (values: z.infer<typeof hotelFormSchema>) => {
    if (!initialHotel?.id) return

    setIsSubmitting(true)
    try {
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

      onUpdated?.()
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating hotel:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Hotel</DialogTitle>
          <DialogDescription>
            Update the hotel details and save your changes.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Hotel Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter hotel name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter description (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating (0-5)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter rating" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional. Defaults to 0 if not provided.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pricePerNight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Per Night</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter price per night"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditHotelForm
