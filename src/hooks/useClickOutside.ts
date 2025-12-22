import { useEffect, useRef } from "react";

function useClickOutside(callback: () => void) {
  // Ubah tipe ref ke HTMLDivElement agar cocok dengan elemen <div>
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback(); // Panggil callback jika klik di luar
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback]);

  return ref; // Kembalikan ref untuk diterapkan pada elemen yang ingin dipantau
}

export default useClickOutside;
