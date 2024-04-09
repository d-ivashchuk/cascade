"use client";

import React from "react";
import { api } from "~/trpc/react";

const TrpcErrorPage = () => {
  const hello = api.example.hello.useQuery({
    text: "world",
  });
  if (hello.isLoading) return <div>Loading...</div>;
  if (hello.error) return <div>Error: {hello.error.message}</div>;
  return <div>{hello.data?.greeting}</div>;
};

export default TrpcErrorPage;
