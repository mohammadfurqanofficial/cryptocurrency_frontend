import { Flex, Icon, Table, Text } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { TablePageFilterBody } from "../../components/PageFilter/TablePageFilterBody";
import { TablePageFilter } from "../../components/PageFilter/TablePageFilterHeader";
import { CriptoResponse } from "../../type/cripto";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import Link from "next/link";
import { parseCookies } from "nookies";
import { FiDownload } from "react-icons/fi";
import { CSVLink } from "react-csv";
import { headersHistory } from "../../csv/index";
import { apiServices } from "../../services/axios";
import { SEO } from "../../SEO";

export default function CoinEspecific({ coin }: { coin: CriptoResponse }) {
  const dataCSV = {
    headers: headersHistory,
    data: coin.history,
    filename: `${coin.name}.csv`,
  };
  return (
    <Flex w="100%" justify="center" flexDir={"column"}>
      <SEO description={coin.name} />
      <Flex pt="30px" px="30px" pb="30px" justify="space-between">
        <Flex align="center">
          <Link passHref href="/">
            <Icon
              as={BsFillArrowLeftCircleFill}
              fontSize="30px"
              cursor={"pointer"}
            />
          </Link>
          <Text fontSize={"30px"} ml="30px">
            {coin.name}
          </Text>
        </Flex>
        <Flex>
          <CSVLink {...dataCSV}>
            <Icon as={FiDownload} fontSize={"30px"} />
          </CSVLink>
        </Flex>
      </Flex>
      <Table variant="simple" size="sm">
        <TablePageFilter />
        <TablePageFilterBody history={coin.history} />
      </Table>
    </Flex>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id }: any = ctx.params;
  const cookie = parseCookies(ctx);
  const api = apiServices(ctx);

  // if (!cookie["cripto.auth"]) {
  //   return {
  //     redirect: {
  //       destination: "/",
  //       permanent: false,
  //     },
  //   };
  // }

  try {
    const { data } = await api.get(
      `${process.env.NEXT_PUBLIC_URL_BACKEND}/coin/take/${id}`,
      {
        headers: {
          Authorization: `Bearer ${cookie["cripto.auth"]}`,
        },
      }
    );

    return {
      props: { coin: data },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};
