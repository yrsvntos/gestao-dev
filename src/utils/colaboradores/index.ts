export interface ColaboradorProps {
    id?: number | string;
    name: string;
    email: string;
    role: "Admin" | "Editor" | "Visitante";
    criadoEm?: Date;
}
  