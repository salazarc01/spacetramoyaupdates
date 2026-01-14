
import { Candidate } from './types';

export const AUTHOR_NAME = "SpaceTramoyaX";
export const AUTHOR_IMAGE = "https://i.postimg.cc/kD3Pn8C6/Photoroom_20251229_195028.png";
export const APP_NAME = "Spacetramoya Updates";

export const INITIAL_POST_CONTENT = "¡Bienvenidos a la era dorada del glamour virtual! 👑✨ Aquí encontrarás las actualizaciones más picantes, resultados en tiempo real y toda la tramoya de los concursos de belleza digitales. ¡Prepárense para brillar!";

export const CANDIDATES: Candidate[] = [
  {
    id: 'c1',
    name: "Ileana Márquez",
    location: "MÉRIDA",
    image: "https://i.postimg.cc/SsnSHdq6/1768404575947.png"
  },
  {
    id: 'c2',
    name: "Praveenar Singh",
    location: "SARABURI",
    image: "https://i.postimg.cc/gJ2d8DrS/1768404575924.png"
  }
].sort((a, b) => a.location.localeCompare(b.location));

export const COLORS = {
  primary: "indigo-600",
  secondary: "purple-700",
  background: "slate-950",
  card: "slate-900",
  accent: "fuchsia-500"
};
