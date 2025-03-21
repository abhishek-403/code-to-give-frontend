import AppRoutes from "./routes";


function App() {
  return (
   
      <div className="fixed inset-0 overflow-auto bg-gradient-to-tr min-h-screen from-dark-70 via-neutral-100 to-dark-60 ">
      <div className="relative  overflow-y-scroll">
        <AppRoutes />
      </div>
    </div>
  );
}

export default App;
