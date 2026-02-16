"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
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

export const hotelFormSchema = z.object({
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

export type HotelFormValues = z.infer<typeof hotelFormSchema>

type AddHotelFormProps = {
  onCreated?: () => void
  onSubmitValues?: (values: HotelFormValues) => Promise<void> | void
  initialValues?: Partial<HotelFormValues>
  onCancel?: () => void
  showCancelButton?: boolean
  submitLabel?: string
  submittingLabel?: string
  resetOnSuccess?: boolean
}

const AddHotelForm = ({
  onCreated,
  onSubmitValues,
  initialValues,
  onCancel,
  showCancelButton = false,
  submitLabel = "Add Hotel",
  submittingLabel = "Adding...",
  resetOnSuccess = true,
}: AddHotelFormProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const getDefaultValues = React.useCallback(
    (): HotelFormValues => ({
      name: initialValues?.name ?? "",
      description: initialValues?.description ?? "",
      location: initialValues?.location ?? "",
      address: initialValues?.address ?? "",
      rating: Number.isFinite(initialValues?.rating) ? Number(initialValues?.rating) : 0,
      pricePerNight: Number.isFinite(initialValues?.pricePerNight)
        ? Number(initialValues?.pricePerNight)
        : 0,
    }),
    [initialValues]
  )

  const form = useForm<HotelFormValues>({
    resolver: zodResolver(hotelFormSchema),
    defaultValues: getDefaultValues(),
  })

  React.useEffect(() => {
    form.reset(getDefaultValues())
  }, [form, getDefaultValues])

  const onSubmit = async (values: HotelFormValues) => {
    const hotelData = {
      name: values.name,
      description: values.description,
      location: values.location,
      address: values.address,
      rating: values.rating || 0,
      pricePerNight: values.pricePerNight,
    }

    setIsSubmitting(true)
    try {
      if (onSubmitValues) {
        await onSubmitValues(values)
      } else {
        const response = await fetch("/api/hotels", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(hotelData),
        })

        if (!response.ok) {
          throw new Error("Failed to add hotel")
        }
      }

      if (resetOnSuccess) {
        form.reset(getDefaultValues())
      }
      onCreated?.()
    } catch (error) {
      console.error("Error submitting hotel form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
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
                  <Input type="number" placeholder="Enter price per night" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {showCancelButton ? (
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          ) : null}
          <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
            {isSubmitting ? submittingLabel : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default AddHotelForm
