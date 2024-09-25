import { Text, Flex, Icon, Table } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { parseCookies } from "nookies";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import { TableComponentBody } from "../components/TableComponentBody";
import { TableComponentHeader } from "../components/TableComponentHeader/TableComponentHeader";
import { SEO } from "../SEO";
import { api } from "../services/apiClient";
import { CriptoResponse } from "../type/cripto";

interface favoriteProps {
  user: {
    name: string;
    coins: CriptoResponse[];
  };
}

export default function Favorite({ user }: favoriteProps) {
  return (
    <Flex flexDir="column">
      <SEO description="Favorite" />
      <Flex p="20px" align="center" w="full" borderBottom="2px solid #ddd">
        <Link passHref href="/">
          <Icon
            as={BsFillArrowLeftCircleFill}
            fontSize="30px"
            cursor={"pointer"}
            mr="20px"
          />
        </Link>
        <Text fontSize={"25px"}>Your favorite coins {user.name}</Text>
      </Flex>
      <Table variant="simple" size="sm">
        <TableComponentHeader />
        <TableComponentBody cripto={user.coins} isFavorite />
      </Table>
    </Flex>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["cripto.auth"]: token } = parseCookies(ctx);

  // if (!token) {
  //   return {
  //     redirect: {
  //       destination: "/login",
  //       permanent: false,
  //     },
  //   };
  // }

  try {
    const { data } = await api.get(
      `${process.env.NEXT_PUBLIC_URL_BACKEND}/favorite/user`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const user = {
      name: data.name,
      coins: data.Favorite.coins,
    };

    return {
      props: { user },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};
