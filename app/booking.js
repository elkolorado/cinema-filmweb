import Link from "next/link"

function bookingLangDetails(booking) {
    if (booking.attributeIds.filter(attribute => attribute?.includes("dubbed"))[0]) {
        return "DUB " + booking.attributeIds.filter(attribute => attribute?.includes("dubbed-lang"))[0]?.split("-")[2]?.toUpperCase()
    }

    if (booking.attributeIds.filter(attribute => attribute?.includes("original-lang-pl"))[0]) {
        return "PL"
    }
    if (booking.attributeIds.filter(attribute => attribute?.includes("original-lang"))[0]) {
        return booking.attributeIds.filter(attribute => attribute?.includes("original-lang"))[0]?.split("-")[2]?.toUpperCase() + " (NAP " + booking.attributeIds.filter(attribute => attribute?.includes("first-subbed"))[0]?.split("-")[3]?.toUpperCase() + ")"
    }

}

function bookingMovieType(booking) {
    let movieType = "";
    if (booking.attributeIds.filter(attribute => attribute?.includes("3d"))[0]) {
        movieType += "3D"
    }

    if (booking.attributeIds.filter(attribute => attribute?.includes("4dx"))[0]) {
        movieType += "4DX"
    }

    if (booking.attributeIds.filter(attribute => attribute?.includes("imax"))[0]) {
        movieType += "IMAX"
    }

    return movieType;

}

export default function Booking({ booking }) {
    return (
        <Link href={booking.link} className="badge text-bg-secondary text-decoration-none me-1">{booking.hour} • <span className="fw-normal">{bookingMovieType(booking)} {bookingLangDetails(booking)} (SALA {booking.auditoriumTinyName}) </span> </Link>
    )
}