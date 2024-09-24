const genres = [
    "action",
    "adventure",
    "animation",
    "bollywood",
    "comedy",
    "crime",
    "documentary",
    "drama",
    "family",
    "fantasy",
    "history",
    "horror",
    "live",
    "musical",
    "nature-documentary",
    "romance",
    "sci-fi",
    "sport",
    "thriller",
    "war",
    "western"
]

const genres_pl = [
    "akcja",
    "przygodowy",
    "animacja",
    "bollywood",
    "komedia",
    "kryminał",
    "dokumentalny",
    "dramat",
    "familijny",
    "fantasy",
    "historyczny",
    "horror",
    "koncert",
    "musical",
    "natura",
    "romans",
    "sci-Fi",
    "sportowy",
    "thriller",
    "wojenny",
    "western"

]

function pickGenre(genre){
    return genre.filter(g => genres.includes(g))[0] && genres_pl[genres.indexOf(genre.filter(g => genres.includes(g))[0])] || "N/A";
}

export default function Genre({ attributeIds , className}) {
    return <span className={className}>{pickGenre(attributeIds)}</span>;
}
