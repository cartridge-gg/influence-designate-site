"use client";

import { CartridgeLogo } from "@cartridge/ui";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import {
  useAccount,
  useConnectors,
  useContractWrite,
} from "@starknet-react/core";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Home() {
  const { available, connect, disconnect } = useConnectors();
  const { address } = useAccount();

  const onConnect = useCallback(() => {
    if (address) {
      return;
    }

    connect(available[0]);
  }, [address, connect, available]);

  return (
    <VStack>
      <CartridgeLogo boxSize={40} />

      {address ? (
        <Form goerliAddr={address} />
      ) : (
        <VStack gap={8}>
          <Text>
            Connect with your <Text as="b">Goerli Cartridge Controller</Text>
          </Text>
          <Button colorScheme="colorful" onClick={onConnect}>
            Connect
          </Button>
        </VStack>
      )}
    </VStack>
  );
}

function Form({ goerliAddr }: { goerliAddr: string }) {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();
  const [mainnetAddr, setMainnetAddr] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const successToast = useToast({
    position: "top",
    render: () => (
      <VStack
        bg="solid.secondary"
        borderRadius="md"
        p={2}
        justifyContent="center"
      >
        <Text>Successfully designated</Text>
      </VStack>
    ),
    duration: 5000,
  });

  const errorToast = useToast({
    position: "top",
    render: () => (
      <VStack bg="text.error" borderRadius="md" p={2} justifyContent="center">
        <Text>Transaction did not go through.</Text>
        <Text>Please try again.</Text>
      </VStack>
    ),
    duration: 5000,
  });

  const { write, error, isSuccess } = useContractWrite({
    calls: [
      {
        contractAddress:
          "0x03c25b36c4f1bd9670f478c7193a4f0298f122e26b153582ecee70dd04fdbae5",
        entrypoint: "designate",
        calldata: [mainnetAddr],
      },
    ],
  });

  const onSubmit = useCallback((values: any) => {
    setIsLoading(true);
    setMainnetAddr(values.address);
  }, []);

  useEffect(() => {
    if (!isLoading || !mainnetAddr) {
      return;
    }

    write();
  }, [isLoading, mainnetAddr, write]);

  useEffect(() => {
    if (!error) {
      return;
    }

    setMainnetAddr(undefined);
    setIsLoading(false);

    errorToast();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useEffect(() => {
    if (!isSuccess) {
      return;
    }

    setMainnetAddr(undefined);
    setIsLoading(false);

    reset();
    successToast();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, reset]);

  return (
    <VStack
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      align="flex-start"
      w="full"
      maxW="container.md"
      gap={8}
    >
      <VStack alignItems="flex-start">
        <Text as="b">Starknet Goerli Address</Text>
        <Text color="text.secondary">{goerliAddr}</Text>
      </VStack>

      <FormControl isInvalid={!!errors.address} mb={4}>
        <FormLabel htmlFor="address">
          <Text as="b">Starknet Mainnet Address</Text>
        </FormLabel>
        <Input
          size="sm"
          id="address"
          placeholder="0x0000000000000000000000000000000000000000000000000000000000000000"
          {...register("address", {
            required: "This is required",
            pattern: {
              value: /^0x[a-fA-F0-9]{64}$/,
              message: "Invalid Starknet address",
            },
          })}
        />
        <FormErrorMessage>
          {errors.address?.message as ReactNode}
        </FormErrorMessage>
      </FormControl>

      <Button
        size="sm"
        colorScheme="colorful"
        isLoading={isLoading}
        alignSelf="center"
        type="submit"
      >
        Designate
      </Button>
    </VStack>
  );
}
