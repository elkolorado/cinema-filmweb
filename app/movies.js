import Image from 'next/image';
import Link from 'next/link';
import Booking from './booking';
async function getData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function getRating(id) {
    try {
        const response = await fetch(`https://www.filmweb.pl/api/v1/film/${id}/rating`, { next: { revalidate: 3600 } });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error occurred while fetching rating for movie with ID ${id}`, error);
        return { rate: "N/A", count: 0 };
    }
}

async function getMovieId(title) {
    try {
        const encodedTitle = encodeURIComponent(title);
        const response = await fetch(`https://www.filmweb.pl/api/v1/live/search?query=${encodedTitle}&pageSize=6`, { 
            headers: {
                "X-Locale": "pl_PL",
            },
            next: { revalidate: 36000 } });
        const data = await response.json();
        return data.searchHits[0].id;
    } catch (error) {
        console.error(`Error occurred while fetching movie ID for title: ${title}`, error);
        return null;
    }
}

export default async function Movies({ showAvailable}) {
    // const movies = await getData(`https://www.cinema-city.pl/pl/data-api-service/v1/quickbook/10103/film-events/in-cinema/${cinemaId}/at-date/2024-01-04?attr=&lang=pl_PL`);

    const cinemas = [
        { id: "1090", displayName: "Bonarka" },
        { id: "1076", displayName: "GK" },
        { id: "1064", displayName: "Zakopianka" }
    ]

    let movies = [];
    let events = [];
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const date = `${year}-${month}-${day}`;
    for (const cinema of cinemas) {


        const data = await getData(`https://www.cinema-city.pl/pl/data-api-service/v1/quickbook/10103/film-events/in-cinema/${cinema.id}/at-date/${date}?attr=&lang=pl_PL`, 
        { cache: 'no-store' });
        events.push(...data.body.events);
        const films = data.body.films.map((film) => {
            const cinemaEvents = data.body.events.filter(event => event.filmId === film.id);
            return { ...film, hours: cinemaEvents, cinema: [cinema.displayName] };
        });
        movies.push(...films);
    }

    movies = Object.values(movies.reduce((uniqueMovies, movie) => {
        if (!uniqueMovies[movie.name]) {
            uniqueMovies[movie.name] = { ...movie, cinema: [] };
        }
        uniqueMovies[movie.name].cinema = [...new Set([...uniqueMovies[movie.name].cinema, ...movie.cinema.map(cinema => ({
            name: cinema,
            hours: movie.hours
                .filter(hour => new Date(hour.eventDateTime) - Date.now() > 0 || new Date(hour.eventDateTime) - Date.now() >= 20 * 60 * 1000) // Filter showtimes that haven't started yet and are within the next 20 minutes
                .map(hour => ({
                    hour: new Date(hour.eventDateTime).toLocaleString('en-US', { hour12: false, hour: 'numeric', minute: 'numeric' }),
                    link: hour.bookingLink,
                    attributeIds: hour.attributeIds,
                    ...hour
                }))
        }))])];
        return uniqueMovies;
    }, {}));


    for (const movie of movies) {
        try {
            const movieId = await getMovieId(movie.name);
            const rating = await getRating(movieId);
            movie.rating = rating.rate.toFixed(1);
            movie.count = rating.count;
        } catch (error) {
            console.error(`Error occurred for movie: ${movie.name}`, error);
        }
    }

    // // Sort movies by rating in descending order
    // movies = movies.sort((a, b) => {
    //     return parseFloat(b.rating) > parseFloat(a.rating); // Sort by rating when both movies have showtimes
    // });

    // // Sort movies by rating in descending order and for undefined ratings, set rating to 0
    movies.sort((a, b) => {
        return parseFloat(b.rating || 0) - parseFloat(a.rating || 0);
    });


    return (
        <>
            <h1 className="display-6 my-5">Cinema City • {day}.{month}.{year}</h1>
            <div className="row  row-cols-md-4 row-cols-2 g-5">
                {movies.map((movie) => (
                    <div key={movie.id} className="col" data-available={movie.cinema.flatMap(c => c.hours).length > 0}>
                        <div className="card h-100">
                            <div className="position-relative">
                                <Link href={movie.link} >
                                    <div className="position-relative">
                                    <div className="position-absolute w-100 h-100" style={{ backgroundImage: "linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent)" }}>
                                    </div>
                                    <img src={movie.posterLink} className="card-img-top" />
                                        
                                    </div>
                                </Link>

                                <div className="position-absolute bottom-0 end-0" data-bs-toggle="tooltip" data-bs-title={movie.count}>
                                    
                                    <span className="badge fs-5 m-3 text-bg-secondary"> 
                                    <img src="https://fwcdn.pl/front/ogfx/icons2/228x228.png" width={16} height={16} className="me-2 mb-1" />
                                    {movie.rating}</span>
                                </div>

                            </div>
                            <div className="card-body">
                                <h5 className="card-title">{movie.name}</h5>
                                {movie.cinema.map(cinema => (
                                    <div key={cinema.id}>
                                        {cinema.hours.length > 0 && (
                                            <div>
                                                <p className="m-0 mt-2"><small>{cinema.name}</small></p>
                                                {cinema.hours.map(booking => (
                                                    <Booking key={booking.hours} booking={booking} />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
