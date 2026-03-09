"use client";

import { useState, useEffect, FormEvent, use } from "react";
import { useAuthors } from "@/context/AuthorsContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditAuthorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { updateAuthor, getAuthorById } = useAuthors();
  const router = useRouter();
  const authorId = parseInt(resolvedParams.id);

  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    description: "",
    image: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    birthDate: "",
    description: "",
    image: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalData, setOriginalData] = useState({
    name: "",
    birthDate: "",
    description: "",
    image: "",
  });

  // H5: Prevención de errores - Advertir sobre cambios sin guardar
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !isSubmitting) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges, isSubmitting]);

  useEffect(() => {
    const author = getAuthorById(authorId);
    if (author) {
      const formattedDate = new Date(author.birthDate)
        .toISOString()
        .split("T")[0];
      const data = {
        name: author.name,
        birthDate: formattedDate,
        description: author.description,
        image: author.image,
      };
      setFormData(data);
      setOriginalData(data); // H3: Control - guardar estado original
      setLoading(false);
    } else {
      alert(
        "Autor no encontrado\n\nEl autor solicitado no existe en la base de datos.",
      );
      router.push("/authors");
    }
  }, [authorId, getAuthorById, router]);

  const validateForm = () => {
    const newErrors = {
      name: "",
      birthDate: "",
      description: "",
      image: "",
    };

    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
      isValid = false;
    }

    if (!formData.birthDate) {
      newErrors.birthDate = "La fecha de nacimiento es obligatoria";
      isValid = false;
    } else {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      if (birthDate > today) {
        newErrors.birthDate = "La fecha de nacimiento no puede ser futura";
        isValid = false;
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = "La descripción es obligatoria";
      isValid = false;
    } else if (formData.description.trim().length < 10) {
      newErrors.description =
        "La descripción debe tener al menos 10 caracteres";
      isValid = false;
    }

    if (!formData.image.trim()) {
      newErrors.image = "La URL de la imagen es obligatoria";
      isValid = false;
    } else {
      try {
        new URL(formData.image);
      } catch {
        newErrors.image = "Debe ser una URL válida";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // H1: Visibilidad del estado
    setHasUnsavedChanges(true);

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // H3: Control y libertad - Permitir restaurar valores originales
  const handleReset = () => {
    if (
      window.confirm(
        "¿Deseas restaurar los valores originales?\n\nSe perderán todos los cambios realizados.",
      )
    ) {
      setFormData(originalData);
      setErrors({ name: "", birthDate: "", description: "", image: "" });
      setHasUnsavedChanges(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      // H1: Visibilidad - Scroll al primer error
      const firstError = document.querySelector(
        '[aria-invalid="true"]',
      ) as HTMLElement;
      firstError?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      await updateAuthor(authorId, formData);
      setHasUnsavedChanges(false);
      // H9: Feedback positivo claro
      alert(
        `✓ ¡Éxito!\n\nLa información de "${formData.name}" ha sido actualizada correctamente.`,
      );
      router.push("/authors");
    } catch (error) {
      // H9: Mensajes de error claros y útiles
      alert(
        `⚠️ Error al actualizar\n\nNo se pudo actualizar la información de "${formData.name}".\n\nPor favor, intenta nuevamente.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // H3: Control y libertad - Permitir cancelar
  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        "⚠️ Tienes cambios sin guardar\n\n¿Estás seguro de que deseas salir?\n\nSe perderán todos los cambios realizados.",
      );
      if (!confirmed) return;
    }
    router.push("/authors");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* H4: Consistencia - Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center space-x-2 text-sm text-[#6E8898]">
          <li>
            <Link href="/" className="hover:text-[#2E5266]">
              Inicio
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/authors" className="hover:text-[#2E5266]">
              Autores
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-[#2E5266]">
            Editar
          </li>
        </ol>
      </nav>

      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2" id="form-title">
          ✏️ Editar Autor
        </h1>
        {/* H10: Ayuda y documentación */}
        <p className="text-[#6E8898]">
          📝 Modifica los campos que desees actualizar. Los campos marcados con{" "}
          <span className="text-[#DB8A74]">*</span> son obligatorios.
        </p>
        {/* H1: Visibilidad del estado */}
        {hasUnsavedChanges && (
          <div className="mt-3 p-3 bg-[#D3D0CB] bg-opacity-50 border-l-4 border-[#DB8A74] text-[#2E5266] text-sm flex items-center justify-between">
            <span>⚠️ Tienes cambios sin guardar</span>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs underline hover:no-underline"
            >
              Restaurar original
            </button>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8"
        aria-labelledby="form-title"
        noValidate
      >
        {/* Campo Nombre */}
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block text-[#2E5266] font-medium mb-2"
          >
            Nombre{" "}
            <span className="text-[#DB8A74]" aria-label="obligatorio">
              *
            </span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 
              ${
                errors.name
                  ? "border-[#DB8A74] focus:ring-[#DB8A74]"
                  : "border-[#9FB1BC] focus:ring-[#6E8898]"
              }`}
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p
              id="name-error"
              className="text-[#DB8A74] text-sm mt-1"
              role="alert"
            >
              {errors.name}
            </p>
          )}
        </div>

        {/* Campo Fecha de Nacimiento */}
        <div className="mb-6">
          <label
            htmlFor="birthDate"
            className="block text-[#2E5266] font-medium mb-2"
          >
            Fecha de Nacimiento{" "}
            <span className="text-[#DB8A74]" aria-label="obligatorio">
              *
            </span>
          </label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 
              ${
                errors.birthDate
                  ? "border-[#DB8A74] focus:ring-[#DB8A74]"
                  : "border-[#9FB1BC] focus:ring-[#6E8898]"
              }`}
            aria-required="true"
            aria-invalid={!!errors.birthDate}
            aria-describedby={errors.birthDate ? "birthDate-error" : undefined}
          />
          {errors.birthDate && (
            <p
              id="birthDate-error"
              className="text-[#DB8A74] text-sm mt-1"
              role="alert"
            >
              {errors.birthDate}
            </p>
          )}
        </div>

        {/* Campo URL de Imagen */}
        <div className="mb-6">
          <label
            htmlFor="image"
            className="block text-[#2E5266] font-medium mb-2"
          >
            URL de la Imagen{" "}
            <span className="text-[#DB8A74]" aria-label="obligatorio">
              *
            </span>
          </label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 
              ${
                errors.image
                  ? "border-[#DB8A74] focus:ring-[#DB8A74]"
                  : "border-[#9FB1BC] focus:ring-[#6E8898]"
              }`}
            aria-required="true"
            aria-invalid={!!errors.image}
            aria-describedby={errors.image ? "image-error" : undefined}
          />
          {errors.image && (
            <p
              id="image-error"
              className="text-[#DB8A74] text-sm mt-1"
              role="alert"
            >
              {errors.image}
            </p>
          )}
        </div>

        {/* Campo Descripción */}
        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-[#2E5266] font-medium mb-2"
          >
            Descripción{" "}
            <span className="text-[#DB8A74]" aria-label="obligatorio">
              *
            </span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 
              ${
                errors.description
                  ? "border-[#DB8A74] focus:ring-[#DB8A74]"
                  : "border-[#9FB1BC] focus:ring-[#6E8898]"
              }`}
            aria-required="true"
            aria-invalid={!!errors.description}
            aria-describedby={
              errors.description ? "description-error" : undefined
            }
          />
          {errors.description && (
            <p
              id="description-error"
              className="text-[#DB8A74] text-sm mt-1"
              role="alert"
            >
              {errors.description}
            </p>
          )}
        </div>

        {/* Botones */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting || !hasUnsavedChanges}
            className="flex-1 bg-[#2E5266] text-white px-6 py-3 rounded-lg hover:bg-[#6E8898] 
              transition-colors disabled:bg-[#9FB1BC] disabled:cursor-not-allowed focus:ring-2 focus:ring-[#6E8898] font-medium"
            aria-busy={isSubmitting}
            title={!hasUnsavedChanges ? "No hay cambios para guardar" : ""}
          >
            {isSubmitting ? "⏳ Guardando cambios..." : "✓ Guardar Cambios"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="flex-1 bg-[#D3D0CB] text-[#2E5266] px-6 py-3 rounded-lg hover:bg-[#9FB1BC] 
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-[#9FB1BC] font-medium"
          >
            ✖ Cancelar
          </button>
        </div>

        {/* H3: Control del usuario - Opción de restaurar */}
        {hasUnsavedChanges && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleReset}
              className="text-sm text-[#6E8898] hover:text-[#2E5266] underline"
            >
              ↺ Restaurar valores originales
            </button>
          </div>
        )}

        {/* H10: Ayuda adicional */}
        <div className="mt-6 p-4 bg-[#D3D0CB] bg-opacity-40 border-l-4 border-[#6E8898] rounded">
          <h3 className="font-semibold text-[#2E5266] mb-2">
            💡 Recordatorio:
          </h3>
          <ul className="text-sm text-[#6E8898] space-y-1">
            <li>
              • Los cambios se guardarán inmediatamente al presionar "Guardar
              Cambios"
            </li>
            <li>
              • Puedes restaurar los valores originales en cualquier momento
            </li>
            <li>• Al cancelar, se perderán todos los cambios no guardados</li>
          </ul>
        </div>
      </form>
    </div>
  );
}
