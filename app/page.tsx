import PrivateRoute from "./components/PrivateRoute";

export default function Home() {
  return (
    <PrivateRoute>
      <main className="h-full w-full flex flex-col justify-center items-center my-12 text-neutral-50">
      </main>
    </PrivateRoute>
  );
}
