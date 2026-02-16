"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {  ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,

    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Hotel, useHotelStore } from "@/store/useHotelStore"
import ActionCell from "./_component/ActionCell"
import AddHotelDialog from "./_component/AddHotelDialog"

import EditHotelForm from "./_component/EditHotelForm"



export const baseColumns: ColumnDef<Hotel>[] = [
    {
        accessorKey: "name",
        header: "Hotel Name",
        cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
            const description = row.getValue("description") as string | null | undefined
            return <div className="max-w-xs truncate">{description || "-"}</div>
        },
    },
    {
        accessorKey: "location",
        header: "Location",
        cell: ({ row }) => <div>{row.getValue("location")}</div>,
    },
    {
        accessorKey: "address",
        header: "Address",
        cell: ({ row }) => <div className="max-w-xs truncate">{row.getValue("address")}</div>,
    },
    {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => <div>{row.getValue("rating")}</div>,
    },
    {
        accessorKey: "pricePerNight",
        header: "Price Per Night",
        cell: ({ row }) => {
            const price = Number(row.getValue("pricePerNight"));
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(price);
            return <div className="text-left font-medium">{formatted}</div>;
        },
    },

  
]

export const HotelTable = () => {
    const { hotels, totalCount, fetchHotels } = useHotelStore();
    const [searchTerm, setSearchTerm] = React.useState<string>("");
    const [page, setPage] = React.useState<number>(1);
    const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    React.useEffect(() => {
        fetchHotels({ name: searchTerm, page });
    }, [fetchHotels, searchTerm, page]);

    React.useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setPage(1);
            fetchHotels({ name: searchTerm, page: 1 });
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, fetchHotels]);

    const [selectedHotel, setSelectedHotel] = React.useState<Hotel | null>(null);
    const totalPages = Math.max(1, Math.ceil(totalCount / 10));

    React.useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages)
        }
    }, [page, totalPages]);

    const handleEditClick = React.useCallback((hotel: Hotel) => {
        setSelectedHotel(hotel)
    }, [])

    const refreshHotels = React.useCallback(async () => {
        await fetchHotels({ name: searchTerm, page })
    }, [fetchHotels, page, searchTerm])

    const columns = React.useMemo<ColumnDef<Hotel>[]>(() => {
        return[
            ...baseColumns,
            {
                id:"actions",
                enableHiding:false,
                cell:({row})=>{
                    const hotel = row.original;
                    return(
                        <ActionCell
                            hotel={hotel}
                            onEditClick={handleEditClick}
                        
                        />
                    )
                }                 
            }
        ]
    },[handleEditClick])


    const table = useReactTable({
        data:hotels,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        manualPagination: true,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="w-full">
            <div className="flex items-center gap-2 py-4">
                <Input
                    placeholder="Filter emails..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="max-w-sm"
                />
                <div className="ml-auto flex items-center gap-2">
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                        Add Hotel
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                Columns <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                Page {page} of {totalPages}
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={page >= totalPages}
                        >
                        Next
                    </Button>
                </div>
            </div>
            <EditHotelForm
                open={Boolean(selectedHotel)}
                onOpenChange={(open) => {
                    if (!open) setSelectedHotel(null)
                }}
                initialHotel={selectedHotel}
                onUpdated={refreshHotels}
            />
            <AddHotelDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onCreated={() => {
                    if (page === 1) {
                        fetchHotels({ name: searchTerm, page: 1 })
                        return
                    }
                    setPage(1)
                }}
            />
        </div>
    )
}
export default HotelTable;
