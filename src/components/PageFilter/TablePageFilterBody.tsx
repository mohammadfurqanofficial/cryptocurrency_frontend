import { Tbody, Tr, Link as LinkChakra, Td } from "@chakra-ui/react";
import Link from "next/link";
import { History } from "../../type/cripto";
import { formatDate, formatNumber, formatValores } from "../../utils/formatAll";
import { TdComponent } from "../TableComponentBody/TdComponent";

export function TablePageFilterBody({ history }: { history: History[] }) {
  return (
    <Tbody>
      {history.map((element, index) => {
        return (
          <Tr key={element.id} display="flex">
            <TdComponent isNumber element={index} width={70} />
            <TdComponent
              isNumber
              element={formatDate(new Date(element?.date))} // Convert to Date
              width={200}
            />
            <TdComponent element={element?.price} isPrice />
            <TdComponent element={formatNumber(element?.volume_24h)} isNumber />
            <TdComponent
              element={formatNumber(element?.volume_change_24h)}
              isNumber
            />
            <TdComponent
              isValue
              element={formatNumber(element?.percent_change_24h)}
            />
            <TdComponent
              isValue
              element={formatNumber(element?.percent_change_1h)}
            />
            <TdComponent
              isValue
              element={formatNumber(element?.percent_change_7d)}
            />
            <TdComponent
              isValue
              element={formatNumber(element?.percent_change_30d)}
            />
            <TdComponent
              isValue
              element={formatNumber(element?.percent_change_60d)}
            />
            <TdComponent
              isValue
              element={formatNumber(element?.percent_change_90d)}
            />
            <TdComponent isPrice element={element?.market_cap} />
            <TdComponent isPrice element={element?.market_cap_dominance} />
            <TdComponent
              isNumber
              element={formatNumber(element?.circulating_supply)}
            />
            <TdComponent
              isNumber
              element={formatNumber(element?.total_supply)}
            />
            <TdComponent isNumber element={formatNumber(element?.max_supply)} />
          </Tr>
        );
      })}
    </Tbody>
  );
}
