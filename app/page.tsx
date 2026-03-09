import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#2E5266] mb-4">
            Gestión de Autores
          </h1>
          <p className="text-xl text-[#6E8898]">
            Sistema CRUD para administrar autores de libros
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/authors"
            className="group block p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-[#6E8898]"
          >
            {" "}
            <h2 className="text-2xl font-semibold text-[#2E5266] mb-2 group-hover:text-[#6E8898]">
              Ver Autores
            </h2>
            <p className="text-[#6E8898]">
              Explora la lista completa de autores, edita su información o
              elimínalos del sistema.
            </p>
          </Link>

          <Link
            href="/crear"
            className="group block p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-[#6E8898]"
          >
            <h2 className="text-2xl font-semibold text-[#2E5266] mb-2 group-hover:text-[#6E8898]">
              Crear Autor
            </h2>
            <p className="text-[#6E8898]">
              Añade un nuevo autor al sistema con toda su información y
              biografía.
            </p>
          </Link>
        </div>

        <div className="bg-[#D3D0CB] bg-opacity-40 rounded-lg p-6 border-l-4 border-[#6E8898]">
          <h3 className="text-lg font-semibold text-[#2E5266] mb-2">
            Funcionalidades disponibles:
          </h3>
          <ul className="space-y-2 text-[#6E8898]">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Listar todos los autores desde la API</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Crear nuevos autores con formularios controlados</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Editar información de autores existentes</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Eliminar autores del sistema</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Navegación fluida entre diferentes páginas</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
