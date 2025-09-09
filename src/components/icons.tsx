import Image from 'next/image';

export function Logo() {
  return (
    <Image
      src="https://i.imgur.com/gC2nZf6.png"
      alt="UnoTI Logo"
      fill
      className="object-contain"
      priority
    />
  );
}
