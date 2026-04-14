import { ReactNode } from "react";

type FloatingElement = {
  content: ReactNode;
  className: string;
};

export function FloatingElementsBackground({ elements }: { elements: FloatingElement[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {elements.map((el, i) => (
        <span
          key={i}
          className={`absolute ${el.className}`}
        >
          {el.content}
        </span>
      ))}
    </div>
  );
}
