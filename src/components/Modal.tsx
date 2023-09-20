import styled from "styled-components";
import {Book} from "../types.ts";

const ModalConantiner = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.19);

  & .form-body {
    margin: auto;
    margin-top: 20vh;
    max-height: 60%;
    max-width: 50%;
    width: fit-content;
    height: fit-content;
    background-color: #f9f9f9;
    padding: 10px 30px 30px 30px;
  }

  & form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;

type FormProps = {
  book?: Book;
  close: () => void;
}

type SubmitValues = {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const extractFormValues = (ev: React.FormEvent<HTMLFormElement>): SubmitValues => {
  const formData = new FormData(ev.target as HTMLFormElement)
  const data = Object.fromEntries([...formData.entries()]) as SubmitValues
  return data
}

export const PurchaseForm: React.FC<FormProps> = ({book, close}) => {


  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const submitValues = extractFormValues(ev)
    window.alert(JSON.stringify(submitValues))
  }


  if (!book) {
    return null;
  }
  return <ModalConantiner onClick={() => close()}>
    <div className={"form-body"} onClick={(ev) => ev.stopPropagation()}>
      <h4>Purchase: {book.displayName} </h4>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="yourInputName">Name:</label>
          <input name={'name'} type="text" required/>
        </div>
        <div>
          <label htmlFor="yourInputName">Email:</label>
          <input name={'email'} type="email"  required/>
        </div>
        <div>
          <label htmlFor="yourInputName">Phone Number: (10 digit) </label>
          <input name={'phone'} type="tel" pattern="[0-9]{10}"  required/>
        </div>
        <div>
          <label htmlFor="yourInputName">Address:</label>
          <input name={'address'} type="text" required/>
        </div>
        <button>submit</button>
      </form>
    </div>

  </ModalConantiner>
}