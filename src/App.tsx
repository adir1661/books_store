import './App.css';
import {QueryClient, QueryClientProvider} from "react-query";
import {Books} from "./components/Books.tsx";


const queryClient = new QueryClient()




function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <h2>Cyber Book Store</h2>
        <Books/>
      </div>
    </QueryClientProvider>
  )
}

export default App
