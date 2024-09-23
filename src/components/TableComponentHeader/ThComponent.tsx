import { Th, useColorMode } from "@chakra-ui/react";
import { ReactNode } from "react";

interface ThComponentsProps {
  width?: number;
  children: ReactNode;
}

export function ThComponents({ children, width = 200 }: ThComponentsProps) {
  const { colorMode } = useColorMode();
  const light = colorMode === "light";
  return (
    <Th
      border={light ? "1px solid #999" : "1px solid #666"}
      style={{display:'flex'}}
      w={`${width}px`}
      fontSize=".8rem"
      p=".5rem"
    >
      {children}
    </Th>
  );
}
