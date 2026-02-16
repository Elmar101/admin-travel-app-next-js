"use client"
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import { Hotel } from '@/store/useHotelStore'


interface ActionsCellProps {
    hotel: Hotel;
    onEditClick: (hotel: Hotel) => void;
  }

  
const ActionCell = ({hotel,onEditClick}:ActionsCellProps) => {
    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className='h-8 w-8'>
                        <MoreHorizontal/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => {
                        setTimeout(() => onEditClick(hotel), 0)
                      }}
                    >
                        Edit Hotel
                    </DropdownMenuItem>
                 
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export default ActionCell
