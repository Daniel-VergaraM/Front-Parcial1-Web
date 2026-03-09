"use client";

import AccessibleForm from "@/components/AccessibleForm";

export default function FormularioEjemplo() {
  const handleSubmit = (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    console.log("📋 Datos del formulario:", data);

    /*
    await fetch('/api/register', {
       method: 'POST',
       body: JSON.stringify(data),
    });
    */
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Componentes con Accesibilidad ARIA y Testing
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ejemplos completos con pruebas de Jest incluidas. Dos componentes
            listos para practicar antes del parcial.
          </p>
        </div>

        {/* Grid de componentes */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Contador Simple */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow-lg mb-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🔢</span>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Contador Simple
                  </h2>
                  <p className="text-sm text-gray-600">
                    Ejemplo básico ideal para empezar
                  </p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
                <p className="font-semibold text-blue-900 mb-1">
                  📝 18 pruebas incluidas
                </p>
                <ul className="text-blue-800 text-xs space-y-1">
                  <li>✓ Renderizado con props</li>
                  <li>✓ Clicks en botones</li>
                  <li>✓ Estados visuales</li>
                  <li>✓ Accesibilidad ARIA</li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="font-bold text-gray-800 mb-2">Otro ejemplo:</h3>
            </div>
          </div>

          {/* Formulario Completo */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">📝</span>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Formulario Controlado
                  </h2>
                  <p className="text-sm text-gray-600">
                    Ejemplo avanzado con validación completa
                  </p>
                </div>
              </div>

              <div className="mb-4 p-3 bg-green-50 rounded text-sm">
                <p className="font-semibold text-green-900 mb-1">
                  📝 20 pruebas incluidas
                </p>
                <ul className="text-green-800 text-xs space-y-1">
                  <li>✓ Validación en tiempo real</li>
                  <li>✓ Atributos ARIA completos</li>
                  <li>✓ Interacciones de usuario</li>
                  <li>✓ Operaciones asíncronas</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario completo en toda la anchura */}
        <div className="mb-12">
          <AccessibleForm onSubmit={handleSubmit} />
        </div>

        {/* Documentación de características */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            📚 Características Implementadas
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-3">
                🎯 Formulario Controlado
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  ✓ Estado manejado con{" "}
                  <code className="bg-gray-100 px-1 rounded">useState</code>
                </li>
                <li>✓ Validación en tiempo real</li>
                <li>✓ Sincronización bidireccional de datos</li>
                <li>✓ Manejo de eventos onChange y onBlur</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-3">
                ♿ Accesibilidad ARIA
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  ✓{" "}
                  <code className="bg-gray-100 px-1 rounded">
                    aria-required
                  </code>{" "}
                  para campos obligatorios
                </li>
                <li>
                  ✓{" "}
                  <code className="bg-gray-100 px-1 rounded">aria-invalid</code>{" "}
                  para indicar errores
                </li>
                <li>
                  ✓{" "}
                  <code className="bg-gray-100 px-1 rounded">
                    aria-describedby
                  </code>{" "}
                  para mensajes de ayuda
                </li>
                <li>
                  ✓ <code className="bg-gray-100 px-1 rounded">aria-live</code>{" "}
                  para notificaciones dinámicas
                </li>
                <li>
                  ✓ <code className="bg-gray-100 px-1 rounded">aria-busy</code>{" "}
                  durante el envío
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-purple-600 mb-3">
                ✅ Validación
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Validación de formato de email</li>
                <li>✓ Requisitos de contraseña segura</li>
                <li>✓ Longitud mínima y máxima</li>
                <li>✓ Mensajes de error contextuales</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-orange-600 mb-3">
                🧪 Testing con Jest
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ 20 pruebas unitarias completas</li>
                <li>✓ 96% de cobertura de código</li>
                <li>✓ Testing Library para React</li>
                <li>✓ Pruebas de accesibilidad ARIA</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Código de ejemplo */}
        <div className="bg-gray-900 rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-white mb-4">
            💻 Uso del Componente
          </h2>
          <pre className="text-sm text-green-400 overflow-x-auto">
            {`import AccessibleForm from "@/components/AccessibleForm";

export default function MiPagina() {
  const handleSubmit = (data) => {
    console.log('Datos:', data);
    // { name, email, password }
  };

  return (
    <AccessibleForm 
      onSubmit={handleSubmit}
      initialValues={{
        name: "Juan Pérez",
        email: "juan@example.com"
      }}
    />
  );
}`}
          </pre>
        </div>

        {/* Comandos Jest */}
        <div className="bg-gray-900 rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-white mb-4">
            🧪 Comandos de Testing
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-gray-400 text-sm mb-1">
                Ejecutar todas las pruebas:
              </p>
              <code className="block bg-gray-800 text-green-400 px-4 py-2 rounded">
                npm test
              </code>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">
                Modo watch (re-ejecuta al guardar):
              </p>
              <code className="block bg-gray-800 text-green-400 px-4 py-2 rounded">
                npm run test:watch
              </code>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">
                Ver cobertura de código:
              </p>
              <code className="block bg-gray-800 text-green-400 px-4 py-2 rounded">
                npm run test:coverage
              </code>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <div className="text-center mt-8">
          <a
            href="/authors"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            ← Volver a Autores
          </a>
        </div>
      </div>
    </div>
  );
}
