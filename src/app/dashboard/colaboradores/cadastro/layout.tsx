import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'GestãoDev | Cadastrar novo Colaborador',
  description: 'O seu sistema empresarial',
}

export default function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <>
          {children}
      </>
    );
  }
  