import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
const useBookSearch = (query, pageNumber) => {
    const [books, setBooks] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
      setBooks([]);
    }, [query])

    useEffect(() => {
        setLoading(true);
        setError(false);
        let cancel;
        console.log("Hello");
        axios({
            method: "GET",
            url: "http://openlibrary.org/search.json",
            params: { q: query, page: pageNumber },
            cancelToken: new axios.CancelToken((c) => (cancel = c)),
        })
            .then((response) => {
                setBooks((prevBooks) => {
                    return [
                        ...new Set([
                            ...prevBooks,
                            ...response.data.docs.map((b) => b.title),
                        ]),
                    ];
                });
                console.log(books);
                setHasMore(response.data.docs.length > 0);
                setLoading(false);
            })
            .catch((e) => {
                if (axios.isCancel(e)) return;
                setError(true);
            });

        return () => cancel();
    }, [query, pageNumber]);

    return {loading, error, books, hasMore};
};

export default useBookSearch;
