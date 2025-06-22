// Updated App.jsx (unchanged logic, just formatting for clarity)
import Navbar from "./components/Navbar";

const App = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="pt-4 bg-gray-100 min-h-screen">{children}</main>
    </>
  );
};

export default App;
