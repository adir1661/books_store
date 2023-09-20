export type Book = {
  id: string;
  displayName: string;
  imageUrl?: string;
}

export type BooksResponse = {
  books: Book[];
  total: number;
  offset: number;
  limit: number;
}

export type RawBook = {
  id: string;
  volumeInfo:{
    title: string;
    imageLinks:{
      smallThumbnail: string;
    }
  }
}

export type BooksArgs = {
  limit: number;
  offset: number;
  searchTerm: string;
}
