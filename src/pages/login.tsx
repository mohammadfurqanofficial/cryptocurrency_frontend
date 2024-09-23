import { Button, Flex, FormControl, Input, Text } from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import { parseCookies, setCookie } from "nookies";
import Router from "next/router";
import { GetServerSideProps } from "next";
import toast, { Toaster } from "react-hot-toast";
import { api } from "../services/apiClient";
import { SEO } from "../SEO";

interface AxiosAuthResponse {
  token: string;
}

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Input validation
    if (!login || !password) {
      toast.error("Please fill in both fields.");
      return;
    }

    try {
      const { data, status } = await api.post<AxiosAuthResponse>(
        "/auth/login", // Ensure this matches your backend login route
        {
          email: login, // Change this if you're using a different field name
          password,
        }
      );

      if (status === 200) {
        setCookie(null, "cripto.auth", data.token, {
          maxAge: 10800, // 3 hours
          path: "/",
        });

        Router.push("/");
      } else {
        toast.error("Invalid email or password.");
      }
    } catch (e) {
      toast.error("Invalid email or password.");
    }
  }

  return (
    <Flex w="100%" h="100vh" align="center" justify="center">
      <SEO description="Login" />
      <Toaster />
      <Flex
        w="500px"
        h="400px"
        boxShadow={"0 0 10px #bbb"}
        textAlign={"center"}
        flexDir="column"
        py="80px"
        px="50px"
        bg="dark"
        borderRadius={"10px"}
      >
        <Text fontSize="32px">Login</Text>
        <FormControl as="form" onSubmit={handleSubmit}>
          <Input
            mb="20px"
            mt="20px"
            placeholder="Your email" // Changed from username to email
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
          <Input
            type="password"
            mb="30px"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" w="40%">
            Enter
          </Button>
        </FormControl>
      </Flex>
    </Flex>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookie = parseCookies(ctx);

  if (cookie["cripto.auth"]) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};
