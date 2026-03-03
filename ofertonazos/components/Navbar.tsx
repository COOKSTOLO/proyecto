export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Ofertonazos</h1>
        <ul className="flex space-x-4">
          <li><a href="/" className="hover:underline">Home</a></li>
          <li><a href="/crear" className="hover:underline">Crear Oferta</a></li>
          <li><a href="/perfil" className="hover:underline">Perfil</a></li>
        </ul>
      </div>
    </nav>
  );
}