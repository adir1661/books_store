import React from "react";
import './App.css';
import {QueryClient, QueryClientProvider} from "react-query";
import {Books} from "./components/Books.tsx";


const queryClient = new QueryClient()




function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Books/>
    </QueryClientProvider>
  )
}

export default App
