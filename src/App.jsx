import { useState, useCallback, useRef } from "react";
import useBookSearch from "./useBookSearch";
function App() {
    const [query, setQuery] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const { loading, error, books, hasMore } = useBookSearch(query, pageNumber);
    const observer = useRef();

    function handleChange(e) {
        setQuery(e.target.value);
        setPageNumber(1);
    }

    const lastBookElementRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect;
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPageNumber((prevPageNumner) => prevPageNumner + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    return (
        <>
            <input type="text" value={query} onChange={handleChange} />
            {books.map((book, index) => {
                if (books.length == index + 1) {
                    return (
                        <div ref={lastBookElementRef} key={book}>
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
