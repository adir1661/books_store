import {useQuery} from "react-query";
import {BooksArgs, BooksResponse, RawBook} from "../types.ts";
import {UseQueryOptions} from "react-query/types/react/types";

const MAX_ITEMS = 40;
export const getBooks = ({limit, offset}: BooksArgs): Promise<BooksResponse> => {
  const paginatedUrl = `https://www.googleapis.com/books/v1/volumes?q=cyber&maxResults=${limit}&startIndex=${offset}`
  console.log({paginatedUrl})
  return fetch(paginatedUrl)
    .then(res => res.json())
    .then(rawResponse => {
      console.log("getBooks fetch")
      console.log({rawResponse})
      return {
        total: rawResponse.totalItems,
        limit,
        offset,
        books: rawResponse.items?.map(({volumeInfo}: RawBook) => (
          {displayName: volumeInfo.title, imageUrl: volumeInfo.imageLinks?.smallThumbnail}
        )) || []
      }
    });
}


export const getBooksMultiplied = async ({limit, offset}: BooksArgs): Promise<BooksResponse> => {
  let counter = limit;
  const tasks: Promise<BooksResponse>[] = []
  while (counter > 0) {
    tasks.push(getBooks({limit: Math.min(counter, MAX_ITEMS), offset: offset + limit - counter}))
    counter = counter - MAX_ITEMS;
  }
  const results = await Promise.all(tasks);
  const totalBooks = results
    .reduce((booksRes, singleRes) => singleRes.books?.length ? ({
        books: booksRes.books.concat(singleRes.books),
        total: singleRes.total,
        offset,
        limit,
      }) : booksRes
    )
  return totalBooks;

}

export const useBooks = (booksArgs: BooksArgs, options?: UseQueryOptions<BooksResponse>) => {
  console.log("useBooks")
  return useQuery<BooksResponse>(
    ["useBooks", booksArgs.offset, booksArgs.limit],
    () => getBooksMultiplied(booksArgs),
    options
  );
}