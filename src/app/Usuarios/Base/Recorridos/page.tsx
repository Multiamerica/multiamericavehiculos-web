import HeaderUsuarios from '@/components/HeaderUsuarios';

export default function Page() {
  return (
    <>
      <HeaderUsuarios />
      <main className='pt-24 px-8 text-white'>
        <h1 className='text-2xl font-bold mb-4'>Página de Recorridos</h1>
        <p className='text-gray-300'>
          Aquí irá el contenido de la sección Recorridos.
        </p>
      </main>
    </>
  );
}
