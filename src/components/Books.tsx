import {useBooks} from "../hooks/useBooks.ts";
import styled from "styled-components";
import {Dispatch, SetStateAction, useState} from "react";
import {BooksArgs} from "../types.ts";

const BooksContainer = styled.div`
  display: flex;
  gap: 20px;
  height: 100vh;
  margin-left: 20px;
  margin-right: 20px;
  flex-wrap: wrap;
  justify-content: start;
`;

const BookCard = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  gap: 10px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  width: 17%;
  max-height: 250px;
  padding: 10px;

  & img {
    max-height: 80px;
  }

  & h5 {
    font-size: 11px;
  }
`;


const PaginationContainer = styled.div`

`;


type PaginationProps = BooksArgs & {
  setPagination: Dispatch<SetStateAction<BooksArgs>>
  total?: number
}


const PaginationSection = ({setPagination, limit, offset, total}: PaginationProps) => {
  if (!total) return null;
  console.log({limit, offset, total})
  const pages = Array(Math.floor(total / limit)).fill(null).map((_, i) => i)
  const currentPage = Math.floor( offset / limit)
  const lastPage = Math.floor((total) / limit) - 1
  return pages.length ? <PaginationContainer>
    {currentPage > 0 && <button
      onClick={() => setPagination({
        limit: limit,
        offset: offset - limit,
      })}
    >
      previous
    </button>}
    {currentPage < lastPage && <button
      onClick={() => setPagination({
        limit: limit,
        offset: Math.min(offset + limit, Math.floor(total / 10) * 10),
      })}
    >
      next
    </button>}
  </PaginationContainer> : null
}


export const Books: React.FC = () => {
  const [{limit, offset}, setPagination] = useState({limit: 50, offset: 0})
  const {data: booksRes, isLoading} = useBooks(
    {limit, offset},
    {keepPreviousData: true}
  );
  console.log({booksRes})
  return <BooksContainer>
    {isLoading && <div>loading...</div>}
    {booksRes?.books.map((book,i) => <BookCard key={i}>
      <h5>{book.displayName}</h5>
      <div>
        {Boolean(book.imageUrl) && <img src={book.imageUrl} alt={'image'}/>}
      </div>
    </BookCard>)}
    <PaginationSection
      setPagination={setPagination}
      limit={limit}
      offset={offset}
      total={booksRes?.total}
    />
  </BooksContainer>

}