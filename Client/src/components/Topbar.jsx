const Topbar = () => {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
      <h1 className="text-lg font-semibold">Welcome back, Prateek 👋</h1>
      <div className="flex items-center gap-3">
        <button className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-indigo-700">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;
