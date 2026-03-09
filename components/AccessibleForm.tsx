"use client";

import { useState, useId, FormEvent } from "react";

interface FormErrors {
  email?: string;
  password?: string;
  name?: string;
}

interface AccessibleFormProps {
  onSubmit?: (data: { name: string; email: string; password: string }) => void;
  initialValues?: {
    name?: string;
    email?: string;
    password?: string;
  };
}

export default function AccessibleForm({
  onSubmit,
  initialValues = {},
}: AccessibleFormProps) {
  const formId = useId();
  const nameId = `${formId}-name`;
  const emailId = `${formId}-email`;
  const passwordId = `${formId}-password`;

  const [formData, setFormData] = useState({
    name: initialValues.name || "",
    email: initialValues.email || "",
    password: initialValues.password || "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "name":
        if (!value.trim()) {
          return "El nombre es obligatorio";
        }
        if (value.trim().length < 2) {
          return "El nombre debe tener al menos 2 caracteres";
        }
        if (value.trim().length > 50) {
          return "El nombre no puede tener más de 50 caracteres";
        }
        break;

      case "email":
        if (!value.trim()) {
          return "El correo electrónico es obligatorio";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return "Ingresa un correo electrónico válido";
        }
        break;

      case "password":
        if (!value) {
          return "La contraseña es obligatoria";
        }
        if (value.length < 8) {
          return "La contraseña debe tener al menos 8 caracteres";
        }
        if (!/[A-Z]/.test(value)) {
          return "Debe contener al menos una letra mayúscula";
        }
        if (!/[a-z]/.test(value)) {
          return "Debe contener al menos una letra minúscula";
        }
        if (!/[0-9]/.test(value)) {
          return "Debe contener al menos un número";
        }
        break;
    }
    return undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name as keyof typeof touched]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setTouched({
      name: true,
      email: true,
      password: true,
    });

    const newErrors: FormErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      const element = document.getElementById(`${formId}-${firstErrorField}`);
      element?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (onSubmit) {
        onSubmit(formData);
      }

      setSubmitSuccess(true);

      setTimeout(() => {
        setFormData({ name: "", email: "", password: "" });
        setTouched({ name: false, email: false, password: false });
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error al enviar formulario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1
        id={`${formId}-title`}
        className="text-2xl font-bold mb-6 text-gray-800"
      >
        Formulario de Registro
      </h1>

      {/* Región de notificaciones con aria-live */}
      <div role="status" aria-live="polite" aria-atomic="true" className="mb-4">
        {submitSuccess && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"
            role="alert"
          >
            <strong className="font-bold">¡Éxito! </strong>
            <span>El formulario se ha enviado correctamente.</span>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        aria-labelledby={`${formId}-title`}
        noValidate
      >
        {/* Campo Nombre */}
        <div className="mb-4">
          <label
            htmlFor={nameId}
            className="block text-gray-700 font-medium mb-2"
          >
            Nombre completo
            <span className="text-red-500 ml-1" aria-label="obligatorio">
              *
            </span>
          </label>
          <input
            type="text"
            id={nameId}
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-required="true"
            aria-invalid={touched.name && !!errors.name}
            aria-describedby={
              touched.name && errors.name ? `${nameId}-error` : `${nameId}-help`
            }
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 
              ${
                touched.name && errors.name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            placeholder="Ej: Juan Pérez"
            disabled={isSubmitting}
          />
          {touched.name && errors.name ? (
            <p
              id={`${nameId}-error`}
              className="text-red-500 text-sm mt-1"
              role="alert"
            >
              {errors.name}
            </p>
          ) : (
            <p id={`${nameId}-help`} className="text-gray-500 text-sm mt-1">
              Ingresa tu nombre completo
            </p>
          )}
        </div>

        {/* Campo Email */}
        <div className="mb-4">
          <label
            htmlFor={emailId}
            className="block text-gray-700 font-medium mb-2"
          >
            Correo electrónico
            <span className="text-red-500 ml-1" aria-label="obligatorio">
              *
            </span>
          </label>
          <input
            type="email"
            id={emailId}
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-required="true"
            aria-invalid={touched.email && !!errors.email}
            aria-describedby={
              touched.email && errors.email
                ? `${emailId}-error`
                : `${emailId}-help`
            }
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 
              ${
                touched.email && errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            placeholder="correo@ejemplo.com"
            disabled={isSubmitting}
          />
          {touched.email && errors.email ? (
            <p
              id={`${emailId}-error`}
              className="text-red-500 text-sm mt-1"
              role="alert"
            >
              {errors.email}
            </p>
          ) : (
            <p id={`${emailId}-help`} className="text-gray-500 text-sm mt-1">
              Usaremos este correo para contactarte
            </p>
          )}
        </div>

        {/* Campo Contraseña */}
        <div className="mb-6">
          <label
            htmlFor={passwordId}
            className="block text-gray-700 font-medium mb-2"
          >
            Contraseña
            <span className="text-red-500 ml-1" aria-label="obligatorio">
              *
            </span>
          </label>
          <input
            type="password"
            id={passwordId}
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-required="true"
            aria-invalid={touched.password && !!errors.password}
            aria-describedby={
              touched.password && errors.password
                ? `${passwordId}-error`
                : `${passwordId}-help`
            }
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 
              ${
                touched.password && errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            placeholder="Mínimo 8 caracteres"
            disabled={isSubmitting}
          />
          {touched.password && errors.password ? (
            <p
              id={`${passwordId}-error`}
              className="text-red-500 text-sm mt-1"
              role="alert"
            >
              {errors.password}
            </p>
          ) : (
            <p id={`${passwordId}-help`} className="text-gray-500 text-sm mt-1">
              Mínimo 8 caracteres con mayúsculas, minúsculas y números
            </p>
          )}
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors
            ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-3"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Enviando...
            </span>
          ) : (
            "Enviar formulario"
          )}
        </button>
      </form>

      {/* Información de accesibilidad adicional */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">
          Características de accesibilidad incluidas:
        </h2>
        <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
          <li>Etiquetas asociadas a campos (labels + htmlFor)</li>
          <li>aria-required para campos obligatorios</li>
          <li>aria-invalid para indicar errores</li>
          <li>aria-describedby para mensajes de ayuda/error</li>
          <li>aria-live para notificaciones dinámicas</li>
          <li>Validación en tiempo real con feedback visual</li>
          <li>Gestión del foco para errores</li>
          <li>Estados disabled y aria-busy</li>
        </ul>
      </div>
    </div>
  );
}
