import clientPromise from "../lib/mongodb";

export default function Top({ movies }) {
    
    return (
        <div>
            <h1>TOP 1000 MOVIES!!</h1>
            <p>
                <small>Acconrding to Stathis Kokmotos</small>
            </p>
            <ul>
                {movies.map((movie) => (
                    <li>
                        <h2>{movie.title}</h2>
                        <h3>{movie.year}</h3>
                        <p>{movie.plot}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
//called before i send to the client
export async function getStaticProps() {
    try {
        const client = await clientPromise; //call to connect
        const db = client.db("sample_mflix");
        const movies = await db
            .collection("movies")
            .find({})
            .sort({"imdb.rating": -1})
            .limit(1000)
            .toArray();
        //props is the default key
        return {props: {movies: JSON.parse(JSON.stringify(movies))}};
    } catch (e) {
        console.error(e);
    }
}
