import { isWalletObject } from '@starknet-io/get-starknet-core';
import { Image, StackSeparator, VStack, useDisclosure } from '@chakra-ui/react';
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useStoreWallet } from '../../Wallet/walletContext';
import { useFrontendProvider } from '../provider/providerContext';
import { useEffect } from 'react';
import { useState } from 'react';
import {
  WalletAccount,
  wallet,
  validateAndParseAddress,
  constants as SNconstants,
} from 'starknet';
import { WALLET_API } from '@starknet-io/types-js';
import { myFrontendProviders } from '@/utils/constants';
import getStarknet from '@starknet-io/get-starknet-core';

// export interface StarknetWalletProvider extends StarknetWindowObject {}
type ValidWallet = {
  wallet: WALLET_API.StarknetWindowObject;
  isValid: boolean;
};

export async function scanObjectForWalletsCustom(
  obj: Record<string, any>, // Browser window object
  isWalletObject: (wallet: any) => boolean
): Promise<ValidWallet[]> {
  const wallets = await getStarknet.getAvailableWallets({});

  const validWallets: ValidWallet[] = await Promise.all(
    wallets.map(async (wallet: WALLET_API.StarknetWindowObject) => {
      let isValid = await checkCompatibility(wallet);
      return { wallet: wallet, isValid: isValid } as ValidWallet;
    })
  );
  console.log(validWallets);
  return validWallets;
}

const checkCompatibility = async (
  myWalletSWO: WALLET_API.StarknetWindowObject
) => {
  let isCompatible: boolean = false;
  try {
    const permissions = (await myWalletSWO.request({
      type: 'wallet_getPermissions',
    })) as string[];
    isCompatible = true;
  } catch {
    (err: any) => {
      console.log('Wallet compatibility failed.\n', err);
    };
  }
  return isCompatible;
};

export default function SelectWallet() {
  const { open, onOpen, onClose } = useDisclosure();

  const myWallet = useStoreWallet((state) => state.StarknetWalletObject);
  const setMyWallet = useStoreWallet((state) => state.setMyStarknetWalletObject);

  const myWalletAccount = useStoreWallet((state) => state.myWalletAccount);
  const setMyWalletAccount = useStoreWallet((state) => state.setMyWalletAccount);
  const myFrontendProviderIndex = useFrontendProvider(
    (state) => state.currentFrontendProviderIndex
  );
  const setCurrentFrontendProviderIndex = useFrontendProvider(
    (state) => state.setCurrentFrontendProviderIndex
  );

  const isConnected = useStoreWallet((state) => state.isConnected);
  const setConnected = useStoreWallet((state) => state.setConnected);

  const displaySelectWalletUI = useStoreWallet(
    (state) => state.displaySelectWalletUI
  );
  const setSelectWalletUI = useStoreWallet((state) => state.setSelectWalletUI);

  const setWalletApi = useStoreWallet((state) => state.setWalletApiList);

  const setChain = useStoreWallet((state) => state.setChain);
  const setAddressAccount = useStoreWallet((state) => state.setAddressAccount);

  const [walletList, setWalletList] = useState<ValidWallet[]>([]);

  const handleSelectedWallet = async (
    selectedWallet: WALLET_API.StarknetWindowObject
  ) => {
    console.log('Trying to connect wallet=', selectedWallet);



    const result = await wallet.requestAccounts(selectedWallet);
    // Check current network (Mainnet or Sepolia)
    const chainId = await wallet.requestChainId(selectedWallet);
    console.log('Current Chain ID:', chainId);

    if (chainId === SNconstants.StarknetChainId.SN_MAIN) {
      // If the wallet is on the Mainnet, use alert() to notify the user
      alert("Please switch your network to Sepolia.");
      // setChain(chainId);
      // setCurrentFrontendProviderIndex(2);  // Assuming Sepolia is at index 2
    } else {
      //   // Set the connection status based on wallet permissions
      //   setMyWallet(selectedWallet); // zustand
      //   setMyWalletAccount(
      //     new WalletAccount(myFrontendProviders[2], selectedWallet)
      //   );

      //   if (typeof result == 'string') {
      //     console.log('This Wallet is not compatible.');
      //     setSelectWalletUI(false);
      //     return;
      //   }
      //   console.log('Current account addr =', result);
      //   if (Array.isArray(result)) {
      //     const addr = validateAndParseAddress(result[0]);
      //     setAddressAccount(addr); // zustand
      //   }

      //   const isConnectedWallet: boolean = await wallet
      //     .getPermissions(selectedWallet)
      //     .then((res: any) =>
      //       (res as WALLET_API.Permission[]).includes(
      //         WALLET_API.Permission.ACCOUNTS
      //       )
      //     );
      //   setConnected(isConnectedWallet); // zustand

      //   setChain(chainId);
      //   setCurrentFrontendProviderIndex(chainId === SNconstants.StarknetChainId.SN_MAIN ? 0 : 2);
    }

    // // Set the connection status based on wallet permissions
    // const isConnectedWallet: boolean = await wallet
    //   .getPermissions(selectedWallet)
    //   .then((res: any) =>
    //     (res as WALLET_API.Permission[]).includes(
    //       WALLET_API.Permission.ACCOUNTS
    //     )
    //   );
    // setConnected(isConnectedWallet); // zustand

    // // Set supported specs (optional for your needs)
    // setWalletApi(await wallet.supportedSpecs(selectedWallet));

    // setSelectWalletUI(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await scanObjectForWalletsCustom(window, isWalletObject);
      return res;
    };
    console.log('Launch select wallet window.');
    fetchData().then((wallets) =>
      setWalletList(wallets.filter((wallet) => wallet.isValid))
    );
    onOpen();
    return () => { };
  }, []);

  return (
    <DialogRoot
      placement={'center'}
      scrollBehavior={'inside'}
      size={'md'}
      open={open}
      closeOnInteractOutside={true}
      onOpenChange={() => {
        setSelectWalletUI(false);
        onClose();
      }}
    >
      <DialogContent>
        <DialogCloseTrigger />
        <DialogHeader
          fontSize='xl'
          fontWeight='bold'
          padding={'20px'}
          marginBottom={'10px'}
        >
          Select a wallet:
        </DialogHeader>
        <DialogBody paddingX={'20px'}>
          <VStack
            separator={<StackSeparator borderColor='gray.200' />}
            gap={3}
            marginBottom={'20px'}
            align='stretch'
          >
            {walletList.map((wallet: ValidWallet, index: number) => {
              const iconW: string =
                typeof wallet.wallet.icon == 'string'
                  ? wallet.wallet.icon
                  : wallet.wallet.icon.light;
              return (
                <Button
                  key={index}
                  variant='surface'
                  fontSize='lg'
                  fontWeight='bold'
                  onClick={() => {
                    setMyWallet(wallet.wallet);
                    setSelectWalletUI(false);
                    handleSelectedWallet(wallet.wallet);
                    onClose();
                  }}
                >
                  <Image src={iconW} width={30} />
                  {wallet.wallet.name + ' ' + wallet.wallet.version}
                </Button>
              );
            })}
          </VStack>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
}
