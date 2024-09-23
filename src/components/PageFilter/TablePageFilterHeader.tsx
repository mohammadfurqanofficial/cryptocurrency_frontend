import { Th, Thead, Tr } from "@chakra-ui/react";
import { ThComponents } from "../TableComponentHeader/ThComponent";

export function TablePageFilter() {
  return (
    <Thead>
      <Tr  style={{display:'flex'}}>
        <ThComponents width={70}>index</ThComponents>
        <ThComponents>Last Updated</ThComponents>
        <ThComponents>Price</ThComponents>
        <ThComponents>Volume 24Hr</ThComponents>
        <ThComponents>Volume Change 24hr</ThComponents>
        <ThComponents>% Change 24hr</ThComponents>
        <ThComponents>% Change 1hr</ThComponents>
        <ThComponents>% Change 7d</ThComponents>
        <ThComponents>% Change 30d</ThComponents>
        <ThComponents>% Change 60d</ThComponents>
        <ThComponents>% Change 90d</ThComponents>
        <ThComponents>Market Cap</ThComponents>
        <ThComponents>Market Cap Dominance</ThComponents>
        <ThComponents>Circulating_supply</ThComponents>
        <ThComponents>Total Supply</ThComponents>
        <ThComponents>Max Supply</ThComponents>
      </Tr>
    </Thead>
  );
}
