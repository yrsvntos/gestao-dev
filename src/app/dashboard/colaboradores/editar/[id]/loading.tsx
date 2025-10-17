export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-gray-600 font-medium">Carregando dados do utilizador...</p>
    </div>
  );
}
