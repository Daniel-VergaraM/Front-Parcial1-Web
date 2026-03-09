import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import AccessibleForm from "../AccessibleForm";

describe("AccessibleForm", () => {
  describe("Renderizado inicial", () => {
    test("renderiza el formulario con todos los elementos", () => {
      render(<AccessibleForm />);

      expect(screen.getByText("Formulario de Registro")).toBeInTheDocument();

      expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /enviar formulario/i }),
      ).toBeInTheDocument();
    });

    test("los campos inician vacíos sin valores iniciales", () => {
      render(<AccessibleForm />);

      const nameInput = screen.getByLabelText(
        /nombre completo/i,
      ) as HTMLInputElement;
      const emailInput = screen.getByLabelText(
        /correo electrónico/i,
      ) as HTMLInputElement;
      const passwordInput = screen.getByLabelText(
        /contraseña/i,
      ) as HTMLInputElement;

      expect(nameInput.value).toBe("");
      expect(emailInput.value).toBe("");
      expect(passwordInput.value).toBe("");
    });

    test("los campos usan valores iniciales cuando se proporcionan", () => {
      render(
        <AccessibleForm
          initialValues={{
            name: "Juan Pérez",
            email: "juan@example.com",
            password: "Password123",
          }}
        />,
      );

      expect(screen.getByLabelText(/nombre completo/i)).toHaveValue(
        "Juan Pérez",
      );
      expect(screen.getByLabelText(/correo electrónico/i)).toHaveValue(
        "juan@example.com",
      );
      expect(screen.getByLabelText(/contraseña/i)).toHaveValue("Password123");
    });
  });

  describe("Atributos ARIA", () => {
    test('los campos obligatorios tienen aria-required="true"', () => {
      render(<AccessibleForm />);

      expect(screen.getByLabelText(/nombre completo/i)).toHaveAttribute(
        "aria-required",
        "true",
      );
      expect(screen.getByLabelText(/correo electrónico/i)).toHaveAttribute(
        "aria-required",
        "true",
      );
      expect(screen.getByLabelText(/contraseña/i)).toHaveAttribute(
        "aria-required",
        "true",
      );
    });

    test('los campos con errores tienen aria-invalid="true"', async () => {
      render(<AccessibleForm />);

      const nameInput = screen.getByLabelText(/nombre completo/i);

      fireEvent.focus(nameInput);
      fireEvent.blur(nameInput);

      await waitFor(() => {
        expect(nameInput).toHaveAttribute("aria-invalid", "true");
      });
    });

    test("los campos tienen aria-describedby apuntando a mensajes de ayuda", () => {
      render(<AccessibleForm />);

      const nameInput = screen.getByLabelText(/nombre completo/i);
      const describedById = nameInput.getAttribute("aria-describedby");

      expect(describedById).toBeTruthy();
      expect(document.getElementById(describedById!)).toBeInTheDocument();
    });

    test("el botón de envío tiene aria-busy cuando está enviando", async () => {
      const mockSubmit = jest.fn();
      render(<AccessibleForm onSubmit={mockSubmit} />);

      await userEvent.type(
        screen.getByLabelText(/nombre completo/i),
        "Juan Pérez",
      );
      await userEvent.type(
        screen.getByLabelText(/correo electrónico/i),
        "juan@example.com",
      );
      await userEvent.type(screen.getByLabelText(/contraseña/i), "Password123");

      const submitButton = screen.getByRole("button", {
        name: /enviar formulario/i,
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toHaveAttribute("aria-busy", "true");
      });
    });
  });

  describe("Validación de campos", () => {
    test("muestra error cuando el nombre está vacío", async () => {
      render(<AccessibleForm />);

      const nameInput = screen.getByLabelText(/nombre completo/i);

      fireEvent.focus(nameInput);
      fireEvent.blur(nameInput);

      await waitFor(() => {
        expect(
          screen.getByText(/el nombre es obligatorio/i),
        ).toBeInTheDocument();
      });
    });

    test("muestra error cuando el nombre es muy corto", async () => {
      render(<AccessibleForm />);

      const nameInput = screen.getByLabelText(/nombre completo/i);

      await userEvent.type(nameInput, "J");
      fireEvent.blur(nameInput);

      await waitFor(() => {
        expect(
          screen.getByText(/debe tener al menos 2 caracteres/i),
        ).toBeInTheDocument();
      });
    });

    test("muestra error cuando el email es inválido", async () => {
      render(<AccessibleForm />);

      const emailInput = screen.getByLabelText(/correo electrónico/i);

      await userEvent.type(emailInput, "correo-invalido");
      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(
          screen.getByText(/correo electrónico válido/i),
        ).toBeInTheDocument();
      });
    });

    test("muestra error cuando la contraseña es muy corta", async () => {
      render(<AccessibleForm />);

      const passwordInput = screen.getByLabelText(/contraseña/i);

      await userEvent.type(passwordInput, "Pass1");
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(
          screen.getByText(/debe tener al menos 8 caracteres/i),
        ).toBeInTheDocument();
      });
    });

    test("muestra error cuando la contraseña no tiene mayúscula", async () => {
      render(<AccessibleForm />);

      const passwordInput = screen.getByLabelText(/contraseña/i);

      await userEvent.type(passwordInput, "password123");
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(
          screen.getByText(/al menos una letra mayúscula/i),
        ).toBeInTheDocument();
      });
    });

    test("muestra error cuando la contraseña no tiene número", async () => {
      render(<AccessibleForm />);

      const passwordInput = screen.getByLabelText(/contraseña/i);

      await userEvent.type(passwordInput, "Password");
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(screen.getByText(/al menos un número/i)).toBeInTheDocument();
      });
    });
  });

  describe("Interacciones del usuario", () => {
    test("limpia el error al comenzar a escribir", async () => {
      render(<AccessibleForm />);

      const nameInput = screen.getByLabelText(/nombre completo/i);

      fireEvent.focus(nameInput);
      fireEvent.blur(nameInput);

      await waitFor(() => {
        expect(
          screen.getByText(/el nombre es obligatorio/i),
        ).toBeInTheDocument();
      });

      await userEvent.type(nameInput, "Juan");

      await waitFor(() => {
        expect(
          screen.queryByText(/el nombre es obligatorio/i),
        ).not.toBeInTheDocument();
      });
    });

    test("los campos se pueden escribir correctamente", async () => {
      render(<AccessibleForm />);

      const nameInput = screen.getByLabelText(
        /nombre completo/i,
      ) as HTMLInputElement;
      const emailInput = screen.getByLabelText(
        /correo electrónico/i,
      ) as HTMLInputElement;

      await userEvent.type(nameInput, "Juan Pérez");
      await userEvent.type(emailInput, "juan@example.com");

      expect(nameInput.value).toBe("Juan Pérez");
      expect(emailInput.value).toBe("juan@example.com");
    });

    test("deshabilita campos cuando está enviando", async () => {
      const mockSubmit = jest.fn(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );
      render(<AccessibleForm onSubmit={mockSubmit} />);

      await userEvent.type(
        screen.getByLabelText(/nombre completo/i),
        "Juan Pérez",
      );
      await userEvent.type(
        screen.getByLabelText(/correo electrónico/i),
        "juan@example.com",
      );
      await userEvent.type(screen.getByLabelText(/contraseña/i), "Password123");

      fireEvent.click(
        screen.getByRole("button", { name: /enviar formulario/i }),
      );

      await waitFor(() => {
        expect(screen.getByLabelText(/nombre completo/i)).toBeDisabled();
      });
    });
  });

  describe("Envío del formulario", () => {
    test("no envía el formulario si hay errores", async () => {
      const mockSubmit = jest.fn();
      render(<AccessibleForm onSubmit={mockSubmit} />);

      fireEvent.click(
        screen.getByRole("button", { name: /enviar formulario/i }),
      );

      await waitFor(() => {
        expect(
          screen.getByText(/el nombre es obligatorio/i),
        ).toBeInTheDocument();
      });

      expect(mockSubmit).not.toHaveBeenCalled();
    });

    test("envía el formulario con datos válidos", async () => {
      const mockSubmit = jest.fn();
      render(<AccessibleForm onSubmit={mockSubmit} />);

      await userEvent.type(
        screen.getByLabelText(/nombre completo/i),
        "Juan Pérez",
      );
      await userEvent.type(
        screen.getByLabelText(/correo electrónico/i),
        "juan@example.com",
      );
      await userEvent.type(screen.getByLabelText(/contraseña/i), "Password123");

      const submitButton = screen.getByRole("button", {
        name: /enviar formulario/i,
      });
      await userEvent.click(submitButton);

      await waitFor(
        () => {
          expect(mockSubmit).toHaveBeenCalledWith({
            name: "Juan Pérez",
            email: "juan@example.com",
            password: "Password123",
          });
        },
        { timeout: 2000 },
      );
    });

    test("muestra mensaje de éxito después del envío", async () => {
      render(<AccessibleForm />);

      await userEvent.type(
        screen.getByLabelText(/nombre completo/i),
        "Juan Pérez",
      );
      await userEvent.type(
        screen.getByLabelText(/correo electrónico/i),
        "juan@example.com",
      );
      await userEvent.type(screen.getByLabelText(/contraseña/i), "Password123");

      fireEvent.click(
        screen.getByRole("button", { name: /enviar formulario/i }),
      );

      await waitFor(
        () => {
          expect(screen.getByText(/éxito/i)).toBeInTheDocument();
        },
        { timeout: 2000 },
      );
    });

    test("resetea el formulario después del envío exitoso", async () => {
      render(<AccessibleForm />);

      const nameInput = screen.getByLabelText(
        /nombre completo/i,
      ) as HTMLInputElement;

      await userEvent.type(nameInput, "Juan Pérez");
      await userEvent.type(
        screen.getByLabelText(/correo electrónico/i),
        "juan@example.com",
      );
      await userEvent.type(screen.getByLabelText(/contraseña/i), "Password123");

      fireEvent.click(
        screen.getByRole("button", { name: /enviar formulario/i }),
      );

      await waitFor(
        () => {
          expect(nameInput.value).toBe("");
        },
        { timeout: 5000 },
      );
    });
  });
});
