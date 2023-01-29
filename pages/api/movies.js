import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
    try {
        const client = await clientPromise; //call to connect
        const db = client.db("sample_mflix");
        const movies = await db
            .collection("movies")
            .find({})
            .sort({"imdb.rating": -1})
            .limit(10)
            .toArray();
        res.json(movies);
    } catch (e) {
        console.error(e);
    }
};
