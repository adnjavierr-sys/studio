import Image from 'next/image';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://picsum.photos/seed/technology/1920/1080"
          alt="Imagen de fondo tecnológica abstracta"
          fill
          className="object-cover"
          data-ai-hint="technology abstract"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      {children}
    </div>
  );
}
