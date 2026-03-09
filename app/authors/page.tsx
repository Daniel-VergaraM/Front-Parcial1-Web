"use client";

import { useEffect, useState } from "react";
import { useAuthors } from "@/context/AuthorsContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function AuthorsPage() {
  const { authors, setAuthors, deleteAuthor } = useAuthors();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8080/api/authors");
        if (!response.ok) {
          throw new Error("Error al obtener los autores");
        }
        const data = await response.json();
        setAuthors(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, [setAuthors]);

  const handleDelete = async (id: number, name: string) => {
    // H5: Prevención de errores - Confirmación detallada
    const confirmMessage =
      `CONFIRMACIÓN DE ELIMINACIÓN\n\n` +
      `Vas a eliminar permanentemente a:\n"${name}"\n\n` +
      `Esta acción NO se puede deshacer.\n\n` +
      `¿Deseas continuar?`;

    if (window.confirm(confirmMessage)) {
      try {
        // H1: Visibilidad del estado
        setLoading(true);
        await deleteAuthor(id);
        // H9: Mensajes de error claros y constructivos
        setSuccessMessage(`✓ Autor "${name}" eliminado exitosamente`);
        setTimeout(() => setSuccessMessage(null), 5000);
      } catch (err) {
        setError(
          `Error al eliminar "${name}". Por favor, verifica tu conexión e intenta nuevamente.`,
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/authors/${id}/edit`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl" role="status" aria-live="polite">
          Cargando autores...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex justify-center items-center min-h-screen"
        role="alert"
        aria-live="assertive"
      >
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  // H6: Reconocer antes que recordar - Filtrado
  const filteredAuthors = authors.filter(
    (author) =>
      author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* H4: Consistencia - Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <Link href="/" className="hover:text-blue-600">
              Inicio
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-gray-900">
            Autores
          </li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4" id="page-title">
          Lista de Autores
        </h1>

        {/* H1: Visibilidad del estado - Mensaje de éxito */}
        {successMessage && (
          <div
            className="mb-4 p-4 bg-[#9FB1BC] bg-opacity-30 border border-[#6E8898] text-[#2E5266] rounded-lg flex items-center justify-between animate-fade-in"
            role="status"
          >
            <span className="font-medium">{successMessage}</span>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-[#2E5266] hover:text-[#6E8898] font-bold"
              aria-label="Cerrar mensaje"
            >
              ✕
            </button>
          </div>
        )}

        {/* H7: Flexibilidad - Búsqueda y accesos rápidos */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              🔍 Buscar autor
            </label>
            <input
              type="search"
              id="search"
              placeholder="Buscar por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-[#9FB1BC] rounded-lg focus:ring-2 focus:ring-[#6E8898] focus:border-transparent"
              aria-label="Campo de búsqueda de autores"
            />
            {searchTerm && (
              <p className="text-sm text-gray-600 mt-1">
                {filteredAuthors.length} resultado
                {filteredAuthors.length !== 1 ? "s" : ""} encontrado
                {filteredAuthors.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          {/* H7: Flexibilidad - Atajo rápido */}
          <div className="flex items-end">
            <button
              onClick={() => router.push("/crear")}
              className="bg-[#6E8898] text-white px-6 py-2 rounded-lg hover:bg-[#2E5266] transition-colors flex items-center gap-2"
              title="Atajo: Ctrl+N"
            >
              ➕ Nuevo Autor
            </button>
          </div>
        </div>

        <p className="text-gray-600" aria-describedby="page-title">
          📊 Total: {authors.length} autor{authors.length !== 1 ? "es" : ""}
        </p>
      </div>

      {/* H2: Relación con el mundo real - Mensajes amigables */}
      {authors.length === 0 ? (
        <div className="text-center py-12 bg-[#D3D0CB] bg-opacity-40 rounded-lg border-2 border-dashed border-[#9FB1BC]">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-semibold mb-2 text-[#2E5266]">
            ¡Comienza tu biblioteca de autores!
          </h2>
          <p className="text-[#6E8898] text-lg mb-6">
            Aún no has agregado ningún autor. <br />
            Empieza creando el primero para construir tu colección.
          </p>
          <button
            onClick={() => router.push("/crear")}
            className="bg-[#2E5266] text-white px-8 py-3 rounded-lg hover:bg-[#6E8898] transition-colors shadow-lg text-lg"
          >
            ➕ Crear Mi Primer Autor
          </button>
        </div>
      ) : filteredAuthors.length === 0 ? (
        <div className="text-center py-12 bg-[#D3D0CB] bg-opacity-40 rounded-lg border border-[#9FB1BC]">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-semibold mb-2 text-[#2E5266]">
            No se encontraron resultados
          </h2>
          <p className="text-[#6E8898] mb-4">
            No hay autores que coincidan con{" "}
            <strong className="text-[#2E5266]">"{searchTerm}"</strong>
          </p>
          <button
            onClick={() => setSearchTerm("")}
            className="bg-[#2E5266] text-white px-6 py-2 rounded-lg hover:bg-[#6E8898] transition-colors"
          >
            Limpiar búsqueda
          </button>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          role="list"
          aria-label="Lista de autores"
        >
          {filteredAuthors.map((author) => (
            <article
              key={author.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              role="listitem"
            >
              <div className="relative h-64 w-full bg-gray-200">
                <Image
                  src={author.image}
                  alt={`Foto de ${author.name}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2">{author.name}</h2>
                <p className="text-gray-600 text-sm mb-3">
                  <span className="font-medium">Fecha de nacimiento:</span>{" "}
                  {new Date(author.birthDate).toLocaleDateString("es-ES")}
                </p>
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {author.description}
                </p>
                {/* H8: Diseño minimalista - Acciones claras */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(author.id)}
                    className="flex-1 bg-[#6E8898] text-white px-4 py-2 rounded-lg hover:bg-[#2E5266] transition-colors focus:ring-2 focus:ring-[#9FB1BC]"
                    aria-label={`Editar información de ${author.name}`}
                    title="Editar este autor"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDelete(author.id, author.name)}
                    className="flex-1 bg-[#DB8A74] text-white px-4 py-2 rounded-lg hover:bg-[#c77560] transition-colors focus:ring-2 focus:ring-[#DB8A74] focus:ring-opacity-50"
                    aria-label={`Eliminar a ${author.name}`}
                    title="Eliminar permanentemente"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
