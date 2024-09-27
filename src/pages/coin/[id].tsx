import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Flex, Text, Table } from "@chakra-ui/react";
import { api } from "../../services/apiClient";
import { SEO } from "../../SEO/index";
import { Header } from "../../components/Header";

// Define the shape of your coin data based on your API response
interface CoinData {
  id: number;
  rank: number;
  name: string;
  symbol: string;
  price: number;
  volume_24h: number;
  percent_change_1h: number;
  percent_change_24h: number;
  market_cap: number;
}

const CoinDetails = () => {
  const router = useRouter();
  const { id } = router.query; // Get coin ID from the route
  const [coinData, setCoinData] = useState<CoinData | null>(null); // Define state with CoinData or null
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // Add page state management

  useEffect(() => {
    // Fetch coin data only if the `id` is available
    if (id) {
      const fetchCoinHistory = async () => {
        try {
          const { data } = await api.get(`/api/coins/coin-history/${id}`);
          setCoinData(data); // Assuming the API returns the coin's history data
          setLoading(false);
        } catch (error: any) {
          console.error("Failed to fetch coin history:", error.message);
          setLoading(false);
        }
      };

      fetchCoinHistory();
    }
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!coinData) {
    return <p>No data found for this coin.</p>;
  }

  // Render coin details using coinData
  return (
    <Flex w="100%" justify="center" flexDir={"column"}>
      <SEO title={`${coinData.name} - Details`} />
        <Header page={page} setPage={setPage} />
      <Text fontSize="2xl" mb={4}>
        {coinData.name} ({coinData.symbol}) - Coin Details
      </Text>
      <Table variant="simple" size="sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Rank</th>
            <th>Name</th>
            <th>Price</th>
            <th>Volume (24h)</th>
            <th>Change (1hr)</th>
            <th>Change (24hr)</th>
            <th>Market Cap</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{coinData.id}</td>
            <td>{coinData.rank}</td>
            <td>{coinData.name}</td>
            <td>${coinData.price?.toFixed(3)}</td>
            <td>${coinData.volume_24h?.toLocaleString()}</td>
            <td>{coinData.percent_change_1h?.toFixed(2)}%</td>
            <td>{coinData.percent_change_24h?.toFixed(2)}%</td>
            <td>${coinData.market_cap?.toLocaleString()}</td>
          </tr>
        </tbody>
      </Table>
    </Flex>
  );
};

export default CoinDetails;
