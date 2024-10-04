import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Flex, Text, Table, Thead, Tbody, Tr, Th, Td, IconButton, CircularProgress, Input } from "@chakra-ui/react";
import { api } from "../../services/apiClient";
import { SEO } from "../../SEO/index";
import { Header } from "../../components/Header";
import { CSVLink } from "react-csv";
import { FiDownload } from "react-icons/fi";

// Define the shape of your coin data based on your API response
interface CoinHistory {
  _id: string;
  price: number;
  volume_24h: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  percent_change_30d: number;
  percent_change_60d: number;
  percent_change_90d: number;
  market_cap: number;
  fully_diluted_market_cap: number;
  lastUpdated: string;
}

interface CoinData {
  _id: string;
  coinId: string;
  name: string;
  symbol: string;
  rank: number;
  coinHistory: CoinHistory[];
}

const CoinDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [coinData, setCoinData] = useState<CoinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [csvData, setCsvData] = useState<CoinHistory[]>([]); // Data for CSV download
  const [csvLoading, setCsvLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(""); // State for the selected date
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (id) {
      const fetchCoinHistory = async () => {
        try {
          const { data } = await api.get(`/coins/coin-history/${id}`);
          setCoinData(data.coin[0]); // Assuming `data.coin` array
          setLoading(false);
        } catch (error: any) {
          console.error("Failed to fetch coin history:", error.message);
          setLoading(false);
        }
      };
      fetchCoinHistory();
    }
  }, [id]);

  // Fetch data for CSV download with the selected date
  const handleDownloadCoinHistory = async () => {
    setCsvLoading(true);
    try {
      const { data } = await api.get(`/coins/coin-history/download/${id}?date=${selectedDate}`);
      console.log("API response data: ", data); // Log the response to check the content
      setCsvData(data); // Save data for CSV
    } catch (error) {
      console.error("Error downloading coin history", error);
    }
    setCsvLoading(false);
  };


  if (loading) {
    return <p>Loading...</p>;
  }

  if (!coinData) {
    return <p>No data found for this coin.</p>;
  }

  return (
    <Flex w="100%" justify="center" flexDir={"column"}>
      <SEO title={`${coinData.name} Details`} />
      <Header page={page} setPage={setPage} />
      <Text fontSize="2xl" mb={4}>
        {coinData.name} ({coinData.symbol}) - Coin Details
      </Text>

      {/* Date Input and Download CSV Button */}
      <Flex mb={4} justify="flex-end" align="center">
        {/* Date Picker */}
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          placeholder="Select a date"
          mr={4}
          maxW="200px"
        />

        {csvLoading ? (
          <CircularProgress isIndeterminate color="blue.200" />
        ) : (
          <CSVLink data={csvData} filename={`${coinData.name}_history_${selectedDate}.csv`}>
            <IconButton
              aria-label="Download Coin History"
              icon={<FiDownload />}
              onClick={handleDownloadCoinHistory}
              isDisabled={!selectedDate || csvData.length === 0} // Disable if no date is selected
            />
            <Text ml="10px">Download Coin History</Text>
          </CSVLink>
        )}
      </Flex>

      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Price</Th>
            <Th>Volume (24h)</Th>
            <Th>Change (1hr)</Th>
            <Th>Change (24hr)</Th>
            <Th>Change (7d)</Th>
            <Th>Change (30d)</Th>
            <Th>Change (60d)</Th>
            <Th>Change (90d)</Th>
            <Th>Market Cap</Th>
            <Th>Market Cap Dominance</Th>
            <Th>Last Updated</Th>
          </Tr>
        </Thead>
        <Tbody>
          {coinData.coinHistory.map((history) => (
            <Tr key={history._id}>
              <Td>${history?.price !== undefined ? history.price.toFixed(3) : "N/A"}</Td>
              <Td>${history?.volume_24h !== undefined ? history.volume_24h.toLocaleString() : "N/A"}</Td>
              <Td>{history?.percent_change_1h !== undefined ? history.percent_change_1h.toFixed(3) + "%" : "N/A"}</Td>
              <Td>{history?.percent_change_24h !== undefined ? history.percent_change_24h.toFixed(3) + "%" : "N/A"}</Td>
              <Td>{history?.percent_change_7d !== undefined ? history.percent_change_7d.toFixed(3) + "%" : "N/A"}</Td>
              <Td>{history?.percent_change_30d !== undefined ? history.percent_change_30d.toFixed(3) + "%" : "N/A"}</Td>
              <Td>{history?.percent_change_60d !== undefined ? history.percent_change_60d.toFixed(3) + "%" : "N/A"}</Td>
              <Td>{history?.percent_change_90d !== undefined ? history.percent_change_90d.toFixed(3) + "%" : "N/A"}</Td>
              <Td>${history?.market_cap !== undefined ? history.market_cap.toLocaleString() : "N/A"}</Td>
              <Td>${history?.fully_diluted_market_cap !== undefined ? history.fully_diluted_market_cap.toLocaleString() : "N/A"}</Td>
              <Td>{history?.lastUpdated !== undefined ? history.lastUpdated.toLocaleString() : "N/A"}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Flex>
  );
};

export default CoinDetails;
