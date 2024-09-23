import { Icon, Td, Text, useColorMode } from "@chakra-ui/react";
import { ReactNode } from "react";
import { TiArrowDownThick, TiArrowUpThick } from "react-icons/ti";

interface TdProps {
  element?: string | number;
  isNumber?: boolean;
  isValue?: boolean;
  isPrice?: boolean;
  width?: number;
  children?: ReactNode;
}

export function TdComponent({
  element,
  isNumber = false,
  isValue = false,
  width = 200,
  children,
  isPrice = false,
}: TdProps) {
  const { colorMode } = useColorMode();
  const light = colorMode === "light";
  if (isNumber) {
    return (
      <Td
        border={light ? "1px solid #999" : "1px solid #666"}
        style={{display:'flex'}}
        w={`${width}px`}
        fontSize=".8rem"
        p=".5rem"
      >
        {element}
      </Td>
    );
  }

  if (isValue) {
    return (
      <Td
        border={light ? "1px solid #999" : "1px solid #666"}
        style={{display:'flex'}}
        w={`${width}px`}
        fontSize=".8rem"
        p=".5rem"
        color={String(element).includes("-") ? "red" : "green"}
      >
        <Text style={{display:'inline-block'}}>
          <Icon
            as={
              String(element).includes("-") ? TiArrowDownThick : TiArrowUpThick
            }
            style={{display:'inline'}}
          />
          {String(element).replace("-", "")}%
        </Text>
      </Td>
    );
  }
  if (children) {
    return (
      <Td
        border={light ? "1px solid #999" : "1px solid #666"}
        style={{display:'flex'}}
        w={`${width}px`}
        fontSize=".8rem"
        p=".5rem"
      >
        {children}
      </Td>
    );
  }

  if (isPrice) {
    return (
      <Td
        border={light ? "1px solid #999" : "1px solid #666"}
        style={{display:'flex'}}
        w={`${width}px`}
        fontSize=".8rem"
        p=".5rem"
        overflow={"hidden"}
      >
        ${Number(element).toFixed(10)}
      </Td>
    );
  }

  return <h1>false</h1>;
}
