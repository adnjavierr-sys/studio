import Image from 'next/image';

export function Logo() {
  return (
    <Image
      src="https://i.imgur.com/3z22Z3A.png"
      alt="UnoTI Logo"
      fill
      className="object-contain"
      priority
    />
  );
}
