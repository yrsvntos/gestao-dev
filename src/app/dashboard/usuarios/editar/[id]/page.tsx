import EditForm from "../../components/editForm";

interface EditPageProps {
    params: Promise<{ id: string }>;
}
export default async function Editar({params}: EditPageProps){

    const {id} = await params

    return(
        <>
            <EditForm id={id}/>
        </>
    );
}