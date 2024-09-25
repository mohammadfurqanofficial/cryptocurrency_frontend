// /* eslint-disable react-hooks/exhaustive-deps */
// import {
//   Flex,
//   Icon,
//   Link as LinkChakra,
//   Tbody,
//   Tr,
//   useColorMode,
//   useDisclosure,
// } from "@chakra-ui/react";
// import Link from "next/link";
// import { memo, useEffect, useState } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import { AiFillStar } from "react-icons/ai";
// import { start } from "repl";
// import { api } from "../../services/apiClient";
// import { CriptoResponse, FavoriteCoin } from "../../type/cripto";
// import { formatDate, formatNumber } from "../../utils/formatAll";
// import { TdComponent } from "./TdComponent";
// import { BsFillExclamationCircleFill } from "react-icons/bs";
// import AlertPopup from "../Header/alertPopup";

// interface TableBodyProps {
//   cripto: CriptoResponse[];
//   favoriteCoins: FavoriteCoin[]; // Ensure FavoriteCoin is defined elsewhere if needed
//   isFavorite?: boolean;
// }

// // interface TableBodyProps {
// //   cripto: CriptoResponse[];
// //   isFavorite?: boolean;
// // }

// function TableComponentBodyComponent({
//   cripto,
//   favoriteCoins,
//   isFavorite = false,
// }: TableBodyProps) {
//   const [favoriteStar, setFavoriteStar] = useState<string[]>([]);
//   const star = cripto.filter((element) => element.favoriteId);
//   const [coins, setCoins] = useState<CriptoResponse[]>(cripto);
//   const { colorMode } = useColorMode();
//   const light = colorMode === "light";

//   useEffect(() => {
//     if (star.length > 0) {
//       star.map((element) => {
//         setFavoriteStar((c) => [...c, element.id]);
//       });
//     }
//   }, [cripto]);

//   async function handleNewStar(id: string) {
//     const { status } = await api.post("/addtofavorite", {
//       id_coin: id,
//     });

//     if (status == 201) {
//       setFavoriteStar((c) => [...c, id]);
//       toast.success("Coin added to your list");
//     } else {
//       toast.error("Opss, something is wrong!!!");
//     }
//   }

//   async function handleRemoveStar(id: string) {
//     const { status } = await api.post("/removefavorite", {
//       id_coin: id,
//     });

//     if (status == 200) {
//       const newCoin = [...coins];
//       const index = newCoin.findIndex((element) => element.id === id);
//       newCoin.splice(index, 1);

//       setCoins([...newCoin]);

//       toast.success("Removed success!");
//     }
//   }
//   return (
//     <Tbody>
//       <Toaster />
//       {coins.map((element, index) => {
//         return (
//           <TableRow key={element.id} element={element} index={index} />
//         );
//       })}
//     </Tbody>
//   );
  
// function TableRow({element, index}:any)  {
//   const { isOpen, onOpen, onClose } = useDisclosure();

// return (
//   <Tr key={element.id} display="flex">
//     <TdComponent isNumber element={index + 1} width={70} />
//     <TdComponent width={100}>
//       <Flex width="full" justify="center">
//         <Icon
//           as={AiFillStar}
//           color={
//             favoriteStar.includes(element.id)
//               ? "yellow.300"
//               : "blue.200"
//           }
//           borderStyle={"outset"}
//           fontSize="20px"
//           cursor="pointer"
//           onClick={() =>
//             !isFavorite
//               ? handleNewStar(element.id)
//               : handleRemoveStar(element.id)
//           }
//         />
//       </Flex>
//     </TdComponent>
//     <TdComponent>
//       <Link passHref href={`/cripto/${element.id_coin}`}>
//         <LinkChakra color={light ? "darkblue" : "blue.300"}>
//           {element.name} {`[${element.symbol}]`}
//         </LinkChakra>
//       </Link>
//     </TdComponent>
//     <TdComponent isNumber element={element.rank} width={100} />
//     <TdComponent
//       isNumber
//       element={
//         element.history.length > 0
//           ? formatDate(element.history[0]?.date)
//           : "No Exist"
//       }
//     />

//     <TdComponent element={element.history[0]?.price} isPrice />
//     <TdComponent
//       isNumber
//       element={formatNumber(element.history[0]?.valume_24h)}
//     />
//     <TdComponent
//       element={formatNumber(element.history[0]?.volume_change_24h)}
//       isNumber
//     />
//     <TdComponent
//       isValue
//       element={formatNumber(element.history[0]?.percent_change_24h)}
//     />

//     <TdComponent
//       isValue
//       element={formatNumber(element.history[0]?.percent_change_1h)}
//     />
//     <TdComponent
//       isValue
//       element={formatNumber(element.history[0]?.percent_change_7d)}
//     />
//     <TdComponent
//       isValue
//       element={formatNumber(element.history[0]?.percent_change_30d)}
//     />
//     <TdComponent
//       isValue
//       element={formatNumber(element.history[0]?.percent_change_60d)}
//     />
//     <TdComponent
//       isValue
//       element={formatNumber(element.history[0]?.percent_change_90d)}
//     />

//     <TdComponent element={element.history[0]?.market_cap} isPrice />
//     <TdComponent
//       element={element.history[0]?.market_cap_dominance}
//       isPrice
//     />
//     <TdComponent
//       isNumber
//       element={formatNumber(element.history[0]?.circulating_supply)}
//     />
//     <TdComponent
//       isNumber
//       element={formatNumber(element.history[0]?.total_supply)}
//     />
//     <TdComponent
//       isNumber
//       element={formatNumber(element.history[0]?.max_supply)}
//     />
//     <TdComponent ><div><Icon
//         as={BsFillExclamationCircleFill}
//         cursor="pointer"
//         fontSize="25px"
//         mt="10px"
//         mr="30px"
//         _hover={{ opacity: "0.8" }}
//         _active={{ opacity: "1" }}
//         onClick={onOpen}
//       />
//       <AlertPopup element={element} isOpen={isOpen} onClose={onClose} /></div>
//       </TdComponent>
//   </Tr>
// );
// }
// }


// export const TableComponentBody = memo(
//   TableComponentBodyComponent,
//   (prevProps, nextProps) => {
//     return Object.is(prevProps.cripto, nextProps.cripto);
//   }
// );
