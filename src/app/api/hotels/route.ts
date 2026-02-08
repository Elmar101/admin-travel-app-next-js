import { NextResponse } from "next/server"
import { prismadb } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const rating = searchParams.get("rating")
    const priceMin = searchParams.get("priceMin")
    const priceMax = searchParams.get("priceMax")
    const name = searchParams.get("name")
    const pageStr = searchParams.get("page") || "1"
    const page = Number(pageStr)
    const limit = 10
    const skip = (page - 1) * limit

    const filters: Array<{
      pricePerNight?: { gte?: number; lte?: number }
      rating?: { gte: number }
      name?: { contains: string; mode: "insensitive" }
    }> = []

    if (priceMin || priceMax) {
      const priceFilter: { gte?: number; lte?: number } = {}
      if (priceMin) priceFilter.gte = Number(priceMin)
      if (priceMax) priceFilter.lte = Number(priceMax)
      filters.push({ pricePerNight: priceFilter })
    }

    if (rating) {
      filters.push({ rating: { gte: Number(rating) } })
    }

    if (name) {
      filters.push({ name: { contains: name, mode: "insensitive" } })
    }

    const whereClause = filters.length > 0 ? { AND: filters } : {}

    const hotels = await prismadb.hotel.findMany({
      where: whereClause,
      skip,
      take: limit,
      include: {
        rooms: true,
      },
      orderBy: { createdAt: "desc" },
    })

    const totalCount = await prismadb.hotel.count({ where: whereClause })

    return NextResponse.json({ hotels, totalCount }, { status: 200 })
  } catch (error) {
    console.error("[HOTEL_GET]", error)
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const name = body?.name?.trim()
    const location = body?.location?.trim()
    const address = body?.address?.trim()
    const description = body?.description?.trim()
    const rating = typeof body?.rating === "number" ? body.rating : Number(body?.rating)
    const pricePerNight = typeof body?.pricePerNight === "number"
      ? body.pricePerNight
      : Number(body?.pricePerNight)

    if (!name || !location || !address || !Number.isFinite(pricePerNight)) {
      return NextResponse.json(
        { error: "Name, location, address və pricePerNight məcburidir." },
        { status: 400 }
      )
    }

    const hotel = await prismadb.hotel.create({
      data: {
        name,
        description: description || null,
        location,
        address,
        rating: Number.isFinite(rating) ? rating : 0,
        pricePerNight,
        photos: Array.isArray(body?.photos) ? body.photos : [],
      },
    })

    return NextResponse.json(hotel, { status: 201 })
  } catch (error) {
    console.error("[HOTEL_POST]", error)
    return NextResponse.json({ error: "Server xətası." }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const id = body?.id
    const name = body?.name?.trim()
    const location = body?.location?.trim()
    const address = body?.address?.trim()
    const description = body?.description?.trim()
    const rating = typeof body?.rating === "number" ? body.rating : Number(body?.rating)
    const pricePerNight = typeof body?.pricePerNight === "number"
      ? body.pricePerNight
      : Number(body?.pricePerNight)

    if (!id || !name || !location || !address || !Number.isFinite(pricePerNight)) {
      return NextResponse.json(
        { error: "ID, name, location, address və pricePerNight məcburidir." },
        { status: 400 }
      )
    }

    const hotel = await prismadb.hotel.update({
      where: { id },
      data: {
        name,
        description: description || null,
        location,
        address,
        rating: Number.isFinite(rating) ? rating : 0,
        pricePerNight,
        photos: Array.isArray(body?.photos) ? body.photos : [],
      },
    })

    return NextResponse.json(hotel, { status: 200 })
  } catch (error) {
    console.error("[HOTEL_PUT]", error)
    return NextResponse.json({ error: "Server xətası." }, { status: 500 })
  }
}
