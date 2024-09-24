/* eslint-disable react-hooks/exhaustive-deps */
import { Flex, Table, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AxiosResponseCoins, CriptoResponse } from "../type/cripto";
import { TableComponentBody } from "../components/TableComponentBody";
import { TableComponentHeader } from "../components/TableComponentHeader/TableComponentHeader";
import { Header } from "../components/Header";
import { api } from "../services/apiClient";
import { SEO } from "../SEO/index";

export default function AllCoins() {
  const [coins, setCoins] = useState<CriptoResponse[]>([]);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data } = await api.get("/auth/profile");
        setUser(data); // Assuming the API returns { name: string, email: string }
      } catch (e: any) {
        if (e.response && e.response.status === 401) {
          router.push("/login"); // Redirect to login page
        } else {
          console.log(e.message);
        }
      }
    }

    fetchProfile();
  }, []);

  useEffect(() => {
    async function fetchAllCoins() {
      try {
        const { data } = await api.get("/cryptocurrency/map", {
          params: {
            start: 1,
            limit: 3000,
          },
          headers: {
            "X-CMC_PRO_API_KEY": process.env.NEXT_PUBLIC_CMC_API_KEY, // Ensure your API key is set in .env.local
          },
        });
        setCoins(data.data); // Assuming the API returns data in this structure
      } catch (e: any) {
        console.log(e.message);
      }
    }

    fetchAllCoins();
  }, []);

  return (
    <Flex w="100%" justify="center" flexDir={"column"}>
      <SEO />
      <Header page={page} setPage={setPage} />

      {user && (
        <Flex
          p={4}
          bg="gray.100"
          borderRadius="md"
          mb={4}
          justify="space-between"
        >
          <Text fontSize="lg">{user.name}</Text>
          <Text fontSize="md" color="gray.600">{user.email}</Text>
        </Flex>
      )}

      <Table variant="simple" size="sm">
        <TableComponentHeader />
        <TableComponentBody cripto={coins} /> {/* Assuming TableComponentBody can handle this structure */}
      </Table>
    </Flex>
  );
}
