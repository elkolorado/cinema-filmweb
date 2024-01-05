import Link from "next/link"

function bookingLangDetails(booking){
    if(booking.attributeIds.filter(attribute => attribute?.includes("dubbed"))[0]){
        return "DUB " + booking.attributeIds.filter(attribute => attribute?.includes("dubbed-lang"))[0]?.split("-")[2]?.toUpperCase()
    }

    if(booking.attributeIds.filter(attribute => attribute?.includes("original-lang-pl"))[0]){
        return "PL"
    }
    if(booking.attributeIds.filter(attribute => attribute?.includes("original-lang"))[0]){
        return booking.attributeIds.filter(attribute => attribute?.includes("original-lang"))[0]?.split("-")[2]?.toUpperCase() + " (NAP " + booking.attributeIds.filter(attribute => attribute?.includes("first-subbed"))[0]?.split("-")[3]?.toUpperCase() + ")"
    }

}

function bookingMovieType(booking){
    if(booking.attributeIds.filter(attribute => attribute?.includes("3d"))[0]){
        if(booking.attributeIds.filter(attribute => attribute?.includes("imax"))[0]){
            return "3D IMAX"
        }
        return "3D"
    }

    if(booking.attributeIds.filter(attribute => attribute?.includes("2d"))[0]){
        return
    }

    if(booking.attributeIds.filter(attribute => attribute?.includes("4dx"))[0]){
        return "4DX"
    }

    if(booking.attributeIds.filter(attribute => attribute?.includes("imax"))[0]){
        return "IMAX"
    }

}

export default function Booking({ booking }) {

    return (
        <Link href={booking.link} className="badge text-bg-secondary text-decoration-none me-1">{booking.hour} • <span className="fw-normal">{bookingMovieType(booking)} {bookingLangDetails(booking)}</span> </Link>
    )
}