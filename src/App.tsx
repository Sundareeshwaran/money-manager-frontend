import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Dashboard, Accounts, Transactions, Analytics } from "@/pages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
