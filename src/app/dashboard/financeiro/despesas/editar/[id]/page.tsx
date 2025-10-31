
import Edit from "../../../components/editForm";

export default async function Editar({params}: {params: Promise<{id: string}>}){
    const {id} = await params
    return(
        <Edit id={id}/>
    )
}