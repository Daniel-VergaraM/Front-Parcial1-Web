"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";

export default function Navigation() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav
      className="bg-[#2E5266] text-white shadow-lg sticky top-0 z-50"
      role="navigation"
      aria-label="Navegación principal"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            {/* H4: Consistencia - Logo/Título siempre visible */}
            <Link
              href="/"
              className="text-xl font-bold hover:text-[#9FB1BC] transition-colors flex items-center gap-2"
              title="Ir a inicio"
            >
              CRUD Autores
            </Link>
            {/* H2: Lenguaje del mundo real */}
            <div className="hidden md:flex space-x-4">
              <Link
                href="/authors"
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  isActive("/authors")
                    ? "bg-[#6E8898] font-semibold shadow-inner"
                    : "hover:bg-[#6E8898]"
                }`}
                aria-current={isActive("/authors") ? "page" : undefined}
                title="Ver todos los autores"
              >
                Lista de Autores
              </Link>
              <Link
                href="/crear"
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  isActive("/crear")
                    ? "bg-[#6E8898] font-semibold shadow-inner"
                    : "hover:bg-[#6E8898]"
                }`}
                aria-current={isActive("/crear") ? "page" : undefined}
                title="Agregar un nuevo autor"
              >
                Crear Autor
              </Link>
            </div>
          </div>
          {/* Botón de cambio de tema */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="px-3 py-2 rounded-lg bg-[#6E8898] hover:bg-[#9FB1BC] transition-colors text-xl"
              aria-label={`Cambiar a modo ${theme === "light" ? "oscuro" : "claro"}`}
              title={`Cambiar a modo ${theme === "light" ? "oscuro" : "claro"}`}
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
          )}
          {/* H1: Visibilidad - Indicador de ubicación */}
          <div className="hidden lg:block">
            <span className="text-[#9FB1BC] text-sm">
              {pathname === "/" && "Inicio"}
              {pathname === "/authors" && "Lista de Autores"}
              {pathname === "/crear" && "Crear Nuevo"}
              {pathname.includes("/edit") && "Editando"}
            </span>
          </div>
        </div>
      </div>
      {/* H4: Consistencia - Menú móvil */}
      <div className="md:hidden border-t border-[#6E8898]">
        <div className="flex justify-around py-2">
          <Link
            href="/authors"
            className={`flex-1 text-center py-2 ${
              isActive("/authors") ? "bg-[#6E8898] font-semibold" : ""
            }`}
            aria-current={isActive("/authors") ? "page" : undefined}
          >
            Lista
          </Link>
          <Link
            href="/crear"
            className={`flex-1 text-center py-2 ${
              isActive("/crear") ? "bg-[#6E8898] font-semibold" : ""
            }`}
            aria-current={isActive("/crear") ? "page" : undefined}
          >
            Crear
          </Link>
        </div>
      </div>
    </nav>
  );
}
