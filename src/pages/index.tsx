/* eslint-disable react-hooks/exhaustive-deps */
import { Flex, Table, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Import useRouter
import { AxiosResponseCoins, CriptoResponse } from "../type/cripto";
import { TableComponentBody } from "../components/TableComponentBody";
import { TableComponentHeader } from "../components/TableComponentHeader/TableComponentHeader";
import { Progress } from "../components/Progress";
import { Header } from "../components/Header";
import { api } from "../services/apiClient";
import { SEO } from "../SEO/index";

export default function Home() {
  const [cripto, setCripto] = useState<CriptoResponse[]>([]);
  const [page, setPage] = useState(1);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data } = await api.get("/auth/profile"); // Adjust the endpoint if necessary
        setUser(data); // Assuming the API returns { name: string, email: string }
      } catch (e: any) {
        // Check if the error indicates that the user is not authenticated
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
    async function Pagination() {
      setCripto([]);
      try {
        const { data } = await api.get<AxiosResponseCoins>(
          `/favorites`,
          {
            params: {
              start: page - 1,
            },
          }
        );

        setCripto(data.filter);
      } catch (e: any) {
        console.log(e.message);
      }
    }
    Pagination();
  }, [page]);

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
        <TableComponentBody cripto={cripto} />
      </Table>
    </Flex>
  );
}
