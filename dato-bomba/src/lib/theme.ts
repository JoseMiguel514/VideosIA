import React, { createContext, useContext } from "react";

/** Un tema define tipografías, colores, fondo y overlay de un video */
export type Theme = {
  name: string;
  num: string; // fuente de cifras y títulos grandes
  body: string; // fuente de etiquetas
  caption: string; // fuente de subtítulos
  captionWeight: number;
  bg: string;
  key: string; // color principal (cifras, palabras clave)
  accent: string; // sellos / negativo
  highlight: string; // títulos y palabra activa
  alt: string; // secundario (barras de comparación)
  text: string;
  stroke: string; // contorno de subtítulos
  panel: string; // fondo de tarjetas
  flash: string; // color del destello en cada corte
  radius: number; // redondeo de tarjetas y sellos
  Background: React.FC<{ total: number }>;
  Overlay: React.FC<{ total: number }>;
};

export const ThemeContext = createContext<Theme | null>(null);
export const useTheme = () => {
  const t = useContext(ThemeContext);
  if (!t) throw new Error("Falta <ThemeContext.Provider>");
  return t;
};
