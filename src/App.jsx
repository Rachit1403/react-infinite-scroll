import { useState, useCallback } from "react";
import useBookSearch from "./useBookSearch";
function App() {
    const [query, setQuery] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const { loading, error, books, hasMore } = useBookSearch(query, pageNumber);

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
            setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
    });

    function handleChange(e) {
        setQuery(e.target.value);
        setPageNumber(1);
    }

    const lastBookElement = useCallback(
        (node) => {
            console.log(node);
            observer.observe(node);
        },
        [loading, hasMore]
    );

    return (
        <>
            <input type="text" value={query} onChange={handleChange} />
            {books.map((book, index) => {
                if (books.length == index + 1) {
                    return (
                        <div ref={lastBookElement} key={book}>
                            {" "}
                            Book {index + 1} : {book}
                        </div>
                    );
                } else {
                    return (
                        <div key={book}>
                            {" "}
                            Book {index + 1} : {book}
                        </div>
                    );
                }
            })}

            <div>{loading && "Loading..."}</div>
            <div>{error && "Error..."}</div>
        </>
    );
}

export default App;
