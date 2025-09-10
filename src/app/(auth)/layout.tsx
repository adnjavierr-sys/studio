import Image from 'next/image';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://picsum.photos/seed/auth-bg/1920/1080"
          alt="Imagen de fondo de un espacio de trabajo moderno"
          fill
          className="object-cover"
          data-ai-hint="office workspace"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      {children}
    </div>
  );
}
