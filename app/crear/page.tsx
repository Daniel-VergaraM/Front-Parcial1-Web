"use client";

import { useState, FormEvent, useEffect } from "react";
import { useAuthors } from "@/context/AuthorsContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateAuthorPage() {
  const { addAuthor } = useAuthors();
  const router = useRouter();

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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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

  const validateForm = () => {
    const newErrors = {
      name: "",
      birthDate: "",
      description: "",
      image: "",
    };

    let isValid = true;

    // H9: Mensajes de error claros y constructivos
    if (!formData.name.trim()) {
      newErrors.name =
        "El nombre es obligatorio. Por favor, ingresa un nombre.";
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name =
        "El nombre es muy corto. Debe tener al menos 2 caracteres.";
      isValid = false;
    } else if (formData.name.trim().length > 100) {
      newErrors.name = "El nombre es muy largo. Máximo 100 caracteres.";
      isValid = false;
    }

    if (!formData.birthDate) {
      newErrors.birthDate = "La fecha de nacimiento es obligatoria.";
      isValid = false;
    } else {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      if (birthDate > today) {
        newErrors.birthDate =
          "La fecha de nacimiento no puede ser futura. Por favor, selecciona una fecha válida.";
        isValid = false;
      }
      const year1800 = new Date("1800-01-01");
      if (birthDate < year1800) {
        newErrors.birthDate =
          "La fecha parece incorrecta. Por favor, verifica el año.";
        isValid = false;
      }
    }

    if (!formData.description.trim()) {
      newErrors.description =
        "La descripción es obligatoria. Cuéntanos sobre este autor.";
      isValid = false;
    } else if (formData.description.trim().length < 10) {
      newErrors.description = `La descripción debe tener al menos 10 caracteres. Faltan ${10 - formData.description.trim().length} caracteres.`;
      isValid = false;
    } else if (formData.description.trim().length > 1000) {
      newErrors.description = `La descripción es muy larga. Máximo 1000 caracteres (tienes ${formData.description.trim().length}).`;
      isValid = false;
    }

    if (!formData.image.trim()) {
      newErrors.image = "La URL de la imagen es obligatoria.";
      isValid = false;
    } else {
      try {
        new URL(formData.image);
        if (!formData.image.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
          newErrors.image =
            "La URL debe apuntar a una imagen (jpg, png, gif, webp, svg).";
          isValid = false;
        }
      } catch {
        newErrors.image =
          "Debe ser una URL válida (ejemplo: https://ejemplo.com/imagen.jpg).";
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
    setHasUnsavedChanges(true); // H1: Visibilidad del estado

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
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
      await addAuthor(formData);
      setHasUnsavedChanges(false);
      // H9: Feedback positivo claro
      alert(
        `✓ ¡Éxito!\n\nEl autor "${formData.name}" ha sido creado correctamente.\n\nSerás redirigido a la lista de autores.`,
      );
      router.push("/authors");
    } catch (error) {
      // H9: Mensajes de error claros y útiles
      alert(
        `Error al crear el autor\n\nNo se pudo crear "${formData.name}".\n\nPosibles causas:\n- Problema de conexión con el servidor\n- El servidor no está disponible\n\nPor favor, verifica tu conexión e intenta nuevamente.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // H3: Control y libertad - Permitir cancelar
  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        "Tienes cambios sin guardar\n\n¿Estás seguro de que deseas salir?\n\nSe perderán todos los datos ingresados.",
      );
      if (!confirmed) return;
    }
    router.back();
  };

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
            Crear
          </li>
        </ol>
      </nav>

      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2" id="form-title">
          Crear nuevo Autor
        </h1>
        {/* H10: Ayuda y documentación */}
        <p className="text-[#6E8898]">
          Completa todos los campos para agregar un nuevo autor a la biblioteca.
          Los campos marcados con <span className="text-[#DB8A74]">*</span> son
          obligatorios.
        </p>
        {/* H1: Visibilidad del estado */}
        {hasUnsavedChanges && (
          <div className="mt-3 p-3 bg-[#D3D0CB] bg-opacity-50 border-l-4 border-[#DB8A74] text-[#2E5266] text-sm">
            Tienes cambios sin guardar
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
            maxLength={100}
            placeholder="Ej: Gabriel García Márquez"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 
              ${
                errors.name
                  ? "border-[#DB8A74] focus:ring-[#DB8A74]"
                  : "border-[#9FB1BC] focus:ring-[#6E8898]"
              }`}
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : "name-help"}
          />
          {/* H6: Reconocer antes que recordar - Indicador de progreso */}
          <div className="flex justify-between items-center mt-1">
            {!errors.name && (
              <p id="name-help" className="text-sm text-[#6E8898]">
                {formData.name.length}/100 caracteres
              </p>
            )}
            {errors.name && (
              <p
                data-testid="name-error"
                id="name-error"
                className="text-[#DB8A74] text-sm"
                role="alert"
              >
                {errors.name}
              </p>
            )}
          </div>
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
            max={new Date().toISOString().split("T")[0]}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 
              ${
                errors.birthDate
                  ? "border-[#DB8A74] focus:ring-[#DB8A74]"
                  : "border-[#9FB1BC] focus:ring-[#6E8898]"
              }`}
            aria-required="true"
            aria-invalid={!!errors.birthDate}
            aria-describedby={
              errors.birthDate ? "birthDate-error" : "birthDate-help"
            }
          />
          {!errors.birthDate && formData.birthDate && (
            <p id="birthDate-help" className="text-sm text-[#6E8898] mt-1">
              ✓ Edad:{" "}
              {new Date().getFullYear() -
                new Date(formData.birthDate).getFullYear()}{" "}
              años
            </p>
          )}
          {errors.birthDate && (
            <p
              data-testid="birthDate-error"
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
            placeholder="https://ejemplo.com/foto-autor.jpg"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 
              ${
                errors.image
                  ? "border-[#DB8A74] focus:ring-[#DB8A74]"
                  : "border-[#9FB1BC] focus:ring-[#6E8898]"
              }`}
            aria-required="true"
            aria-invalid={!!errors.image}
            aria-describedby={errors.image ? "image-error" : "image-help"}
          />
          {/* H6: Reconocer - Vista previa de imagen */}
          {!errors.image &&
            formData.image &&
            formData.image.match(/^https?:\/\/.+/) && (
              <div className="mt-2 p-2 border border-[#9FB1BC] rounded-lg bg-[#D3D0CB] bg-opacity-30">
                <p className="text-sm text-[#6E8898] mb-2">Vista previa:</p>
                <img
                  src={formData.image}
                  alt="Vista previa"
                  className="max-w-full h-32 object-cover rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          {!errors.image && (
            <p id="image-help" className="text-sm text-[#6E8898] mt-1">
              Formato: jpg, png, gif, webp o svg
            </p>
          )}
          {errors.image && (
            <p
              data-testid="image-error"
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
            Descripción / Biografía{" "}
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
            maxLength={1000}
            placeholder="Escribe una breve biografía del autor, sus obras más destacadas, premios, etc."
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 
              ${
                errors.description
                  ? "border-[#DB8A74] focus:ring-[#DB8A74]"
                  : "border-[#9FB1BC] focus:ring-[#6E8898]"
              }`}
            aria-required="true"
            aria-invalid={!!errors.description}
            aria-describedby={
              errors.description ? "description-error" : "description-help"
            }
          />
          <div className="flex justify-between items-center mt-1">
            {!errors.description && (
              <p id="description-help" className="text-sm text-[#6E8898]">
                {formData.description.length}/1000 caracteres
                {formData.description.length < 10 && ` (mínimo 10)`}
              </p>
            )}
            {errors.description && (
              <p
                data-testid="description-error"
                id="description-error"
                className="text-[#DB8A74] text-sm"
                role="alert"
              >
                {errors.description}
              </p>
            )}
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-4">
          <button
            data-testid="submit-button"
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-[#2E5266] text-white px-6 py-3 rounded-lg hover:bg-[#6E8898] 
              transition-colors disabled:bg-[#9FB1BC] disabled:cursor-not-allowed focus:ring-2 focus:ring-[#6E8898] font-medium"
            aria-busy={isSubmitting}
          >
            {isSubmitting ? "Creando autor..." : "Crear Autor"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="flex-1 bg-[#D3D0CB] text-[#2E5266] px-6 py-3 rounded-lg hover:bg-[#9FB1BC] 
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-[#9FB1BC] font-medium"
          >
            Cancelar
          </button>
        </div>

        {/* H10: Ayuda adicional */}
        <div className="mt-6 p-4 bg-[#D3D0CB] bg-opacity-40 border-l-4 border-[#6E8898] rounded">
          <h3 className="font-semibold text-[#2E5266] mb-2">Consejos:</h3>
          <ul className="text-sm text-[#6E8898] space-y-1">
            <li>
              • Asegúrate de que la URL de la imagen sea accesible públicamente
            </li>
            <li>• Usa el formato de fecha DD/MM/YYYY para mejor legibilidad</li>
            <li>
              • Una buena descripción ayuda a los usuarios a conocer mejor al
              autor
            </li>
            <li>• Puedes cancelar en cualquier momento sin guardar cambios</li>
          </ul>
        </div>
      </form>
    </div>
  );
}
