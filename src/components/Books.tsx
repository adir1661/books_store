import {useBooks} from "../hooks/useBooks.ts";
import styled from "styled-components";
import {Dispatch, SetStateAction, useEffect, useMemo, useRef, useState} from "react";
import {BooksArgs} from "../types.ts";
import {PurchaseForm} from "./Modal.tsx";

const BooksContainer = styled.div`
  display: flex;
  gap: 20px;
  height: 100vh;
  margin-left: 20px;
  margin-right: 20px;
  flex-wrap: wrap;
  justify-content: start;
  padding-bottom: 20px;
  padding-top: 20px;
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
  padding-bottom: 20px;
  display: flex;
  justify-content: end;
  width: 100%;
  align-items: center;
  gap: 10px;
  
  & .select{
    display: flex;
    flex-direction: column;
    background-color: #fff;
    & label{
      font-size: 13px;
    }
  }
  
  & select {
    margin: 0 0 0 10px;
    appearance: none;
    border: solid darkblue 1px;
    border-radius: 5px;
    text-align: center;
    background-color: transparent;
    padding: 0 1em 0 0;
    font-family: inherit;
    font-size: inherit;
    cursor: inherit;
    line-height: inherit;
  }
`;


type PaginationProps = Omit<BooksArgs, "searchTerm"> & {
  setPagination: Dispatch<SetStateAction<Omit<BooksArgs, "searchTerm">>>
  total?: number
}


const PaginationSection: React.FC<PaginationProps> = ({setPagination, limit, offset, total}) => {
  if (!total) return null;
  console.log({limit, offset, total})
  const pages = Array(Math.floor(total / limit)).fill(null).map((_, i) => i)
  const currentPage = Math.floor( offset / limit)
  const lastPage = Math.floor((total) / limit) - 1

  const onMaxPageChange = (ev: React.ChangeEvent<HTMLSelectElement>)=>{
    setPagination({
      limit: Number(ev.target.value)  ,
      offset: 0,
    })
  }

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
    <div className={'select'}>
      <label htmlFor="select">Page Size</label>
      <select name="select" value={limit} onChange={onMaxPageChange}>
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
      </select>
    </div>
  </PaginationContainer> : null
}

const useDebounce = (value:string, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState("");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => setDebouncedValue(value), delay);

    return () => {
      clearTimeout(timerRef.current as number);
    };
  }, [value, delay]);

  return debouncedValue;
};


export const Books: React.FC = () => {
  const [{limit, offset}, setPagination] = useState({limit: 50, offset: 0})
  const [search, setSearch ] = useState<string>('')

  const searchTerm = useDebounce(search)
  const {data: booksRes, isLoading} = useBooks(
    {limit, offset, searchTerm},
    {keepPreviousData: true}
  );
  const [selectedBookId, selectBook] = useState<string | null >(null)
  const selectedBook = useMemo(()=>(booksRes?.books.find(({id})=>id === selectedBookId)), [selectedBookId, booksRes])
  return <>
    <input type="text" onChange={(ev)=> setSearch(ev.target.value)}/>
    <BooksContainer>
    {isLoading && <div>loading...</div>}
    {booksRes?.books.map((book,i) => <BookCard onClick={()=>{selectBook((book.id))}} key={i}>
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
    <PurchaseForm
      close={()=> selectBook(null)}
      book={selectedBook}
    />
  </BooksContainer>
    </>

}