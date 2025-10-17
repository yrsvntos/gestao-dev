import EditForm from "@/app/dashboard/components/editForm"

interface EditPageProps {
    params: Promise<{ id: string }>;
}

export default async function Editar({params} : EditPageProps){

    const {id} = await params

    return(
        <>
            <div className="pt-8">
                <EditForm id={id} />
            </div>
        </>
    )
}