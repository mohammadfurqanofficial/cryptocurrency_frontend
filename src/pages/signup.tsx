// src/pages/Signup.tsx

import { Button, Flex, FormControl, Input, Text } from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import Router from "next/router";
import toast, { Toaster } from "react-hot-toast";
import { api } from "../services/apiClient";
import { SEO } from "../SEO";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Input validation
    if (!name || !email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const { status } = await api.post("/auth/signup", {
        name,
        email,
        password,
      });

      if (status === 201) {
        toast.success("Signup successful! Redirecting to login...");
        setTimeout(() => {
          Router.push("/login");
        }, 2000);
      } else {
        toast.error("Signup failed. Please try again.");
      }
    } catch (e) {
      toast.error("Signup failed. Please try again.");
      console.error(e);
    }
  }

  return (
    <Flex w="100%" h="100vh" align="center" justify="center">
      <SEO description="Signup" />
      <Toaster />
      <Flex
        w="500px"
        h="auto"
        boxShadow={"0 0 10px #bbb"}
        textAlign={"center"}
        flexDir="column"
        py="40px"
        px="50px"
        bg="dark"
        borderRadius={"10px"}
      >
        <Text fontSize="32px">Sign Up</Text>
        <FormControl as="form" onSubmit={handleSubmit}>
          <Input
            mb="20px"
            mt="20px"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            mb="20px"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            mb="30px"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" w="40%">
            Sign Up
          </Button>
        </FormControl>
      </Flex>
    </Flex>
  );
}
