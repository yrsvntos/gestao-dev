import z from "zod";


export const role = ["Admin", "Editor", "Visitante"];
export const schema = z.object({
    name: z.string().min(2, "O nome deve conter no minímo 2 caracteres!").nonempty("O campo de nome é obrigatório!"),
    email: z.string().email("Insira um e-mail válido").nonempty("O campo de email é obrigatório!"),
    role: z.enum(["Admin", "Editor", "Visitante"]).refine((val) => ["Admin", "Editor", "Visitante"].includes(val), {message: "Escolha inválida!"} )
})



export type UserForm = z.infer<typeof schema>