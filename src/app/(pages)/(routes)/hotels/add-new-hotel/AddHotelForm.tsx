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

type AddHotelFormProps = {
  onCreated?: () => void
  onCancel?: () => void
  showCancelButton?: boolean
}

const AddHotelForm = ({
  onCreated,
  onCancel,
  showCancelButton = false,
}: AddHotelFormProps) => {
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

  const onSubmit = async (values: z.infer<typeof hotelFormSchema>) => {
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

      form.reset()
      onCreated?.()
    } catch (error) {
      console.error("Error adding hotel:", error)
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
            {isSubmitting ? "Adding..." : "Add Hotel"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default AddHotelForm
