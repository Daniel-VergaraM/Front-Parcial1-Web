import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Crear from "../page";
import { AuthorsProvider } from "@/context/AuthorsContext";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
}));

const renderWithProvider = () => {
  return render(
    <AuthorsProvider>
      <Crear />
    </AuthorsProvider>,
  );
};

describe("Crear", () => {
  describe("Renderizado inicial", () => {
    test("renderizado del formulario con todos los elementos", () => {
      renderWithProvider();

      expect(screen.getByText("Crear nuevo Autor")).toBeInTheDocument();

      expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/fecha de nacimiento/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/url de la imagen/i)).toBeInTheDocument();
      expect(
        screen.getByLabelText(/descripción \/ biografía/i),
      ).toBeInTheDocument();

      expect(screen.getByRole("button", { name: "Crear Autor" }));
    });

    test("campos vacíos sin valores iniciales", () => {
      renderWithProvider();

      const nameInput = screen.getByLabelText(/nombre/i) as HTMLInputElement;

      const fechaInput = screen.getByLabelText(
        /fecha de nacimiento/i,
      ) as HTMLInputElement;

      const urlInput = screen.getByLabelText(
        /url de la imagen/i,
      ) as HTMLInputElement;

      const descInput = screen.getByLabelText(
        /descripción \/ biografía/i,
      ) as HTMLInputElement;

      expect(nameInput.value).toBe("");
      expect(fechaInput.value).toBe("");
      expect(urlInput.value).toBe("");
      expect(descInput.value).toBe("");
    });

    test("campos requeridos muestran error al enviar vacíos", async () => {
      renderWithProvider();
      const botonCrear = screen.getByRole("button", {
        name: "Crear Autor",
      }) as HTMLButtonElement;
      userEvent.click(botonCrear);
      await waitFor(() => {
        expect(
          screen.getByText(
            /El nombre es obligatorio. Por favor, ingresa un nombre./i,
          ),
        ).toBeInTheDocument();
        expect(
          screen.getByText(/La fecha de nacimiento es obligatoria./i),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            /La descripción es obligatoria. Cuéntanos sobre este autor./i,
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(/La URL de la imagen es obligatoria./i),
        ).toBeInTheDocument();
      });
    });

    test("verificar condiciones de valores de los campos", async () => {
      renderWithProvider();

      const nameInput = screen.getByLabelText(/nombre/i) as HTMLInputElement;

      const fechaInput = screen.getByLabelText(
        /fecha de nacimiento/i,
      ) as HTMLInputElement;

      const urlInput = screen.getByLabelText(
        /url de la imagen/i,
      ) as HTMLInputElement;

      const descInput = screen.getByLabelText(
        /descripción \/ biografía/i,
      ) as HTMLInputElement;

      userEvent.type(nameInput, "A");
      userEvent.type(fechaInput, "2028-01-01");
      userEvent.type(urlInput, "https://example.com/archivo.txt");
      userEvent.type(descInput, "B".repeat(9));

      const botonCrear = screen.getByRole("button", {
        name: "Crear Autor",
      }) as HTMLButtonElement;

      userEvent.click(botonCrear);

      await waitFor(() => {
        expect(screen.getByTestId("name-error")).toBeInTheDocument();

        expect(screen.getByTestId("birthDate-error")).toBeInTheDocument();

        expect(screen.getByTestId("image-error")).toBeInTheDocument();

        expect(screen.getByTestId("description-error")).toBeInTheDocument();
      });
    });
  });
});
