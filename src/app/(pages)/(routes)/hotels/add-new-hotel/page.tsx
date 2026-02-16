"use client"

import AddHotelForm from "./AddHotelForm"

const AddNewHotel = () => {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-4xl items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-2xl">
        <AddHotelForm />
      </div>
    </div>
  )
}

export default AddNewHotel
