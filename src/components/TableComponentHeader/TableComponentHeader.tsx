import { Th, Thead, Tr } from "@chakra-ui/react";
import { ThComponents } from "./ThComponent";

export function TableComponentHeader() {
  return (
    <Thead>
      <Tr style={{display:'flex'}}>
        <ThComponents width={70}>Index</ThComponents>
        <ThComponents width={100}>Favorite</ThComponents>
        <ThComponents>Name</ThComponents>
        <ThComponents width={100}>Rank</ThComponents>
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
        <ThComponents>Alerts</ThComponents>
      </Tr>
    </Thead>
  );
}
