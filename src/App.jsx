import Navbar from "./components/Navbar";

const App = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="pt-4">{children}</main>
    </>
  );
};

export default App;
