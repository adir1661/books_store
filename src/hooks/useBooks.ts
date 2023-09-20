import {useQuery} from "react-query";
import {BooksArgs, BooksResponse, RawBook} from "../types.ts";
import {UseQueryOptions} from "react-query/types/react/types";

const MAX_ITEMS = 40;
export const getBooks = ({limit, offset, searchTerm}: BooksArgs): Promise<BooksResponse> => {
  const paginatedUrl = `https://www.googleapis.com/books/v1/volumes?q=cyber${searchTerm ? '+intitle:' + searchTerm : ''}&maxResults=${limit}&startIndex=${offset}`
  return fetch(paginatedUrl)
    .then(res => res.json())
    .then(rawResponse => {
      return {
        total: rawResponse.totalItems,
        limit,
        offset,
        books: rawResponse.items?.map(({volumeInfo, id}: RawBook) => (
          {
            id: id,
            displayName: volumeInfo.title,
            imageUrl: volumeInfo.imageLinks?.smallThumbnail
          }
        )) || []
      }
    });
}


export const getBooksMultiplied = async ({limit, offset, searchTerm}: BooksArgs): Promise<BooksResponse> => {
  let counter = limit;
  const tasks: Promise<BooksResponse>[] = []
  while (counter > 0) {
    tasks.push(getBooks({limit: Math.min(counter, MAX_ITEMS), offset: offset + limit - counter, searchTerm}))
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
  return useQuery<BooksResponse>(
    ["useBooks", booksArgs.offset, booksArgs.limit, booksArgs.searchTerm],
    () => getBooksMultiplied(booksArgs),
    options
  );
}