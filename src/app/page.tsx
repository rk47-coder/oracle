'use client';

import { useState } from 'react';
import { Center, Box, Tabs } from '@chakra-ui/react';
import { Button } from '@/components/ui/button';
import { Provider } from '@/components/ui/provider';
import { useStoreWallet } from './components/Wallet/walletContext';
import SelectWallet from './components/client/WalletHandle/SelectWallet';
import { useFrontendProvider } from './components/client/provider/providerContext';

export default function Page() {
  const displaySelectWalletUI = useStoreWallet(
    (state) => state.displaySelectWalletUI
  );
  const setSelectWalletUI = useStoreWallet((state) => state.setSelectWalletUI);

  const addressAccountFromContext = useStoreWallet((state) => state.address);
  const setAddressAccount = useStoreWallet((state) => state.setAddressAccount);

  const myFrontendProviderIndex = useFrontendProvider(
    (state) => state.currentFrontendProviderIndex
  );
  const setCurrentFrontendProviderIndex = useFrontendProvider(
    (state) => state.setCurrentFrontendProviderIndex
  );

  const myWallet = useStoreWallet((state) => state.StarknetWalletObject);
  const setMyWallet = useStoreWallet(
    (state) => state.setMyStarknetWalletObject
  );

  const chainFromContext = useStoreWallet((state) => state.chain);
  const setChain = useStoreWallet((state) => state.setChain);

  const accountFromContext = useStoreWallet((state) => state.account);
  const setAccount = useStoreWallet((state) => state.setAccount);

  const providerFromContext = useStoreWallet((state) => state.provider);
  const setProvider = useStoreWallet((state) => state.setProvider);

  const isConnected = useStoreWallet((state) => state.isConnected);
  const setConnected = useStoreWallet((state) => state.setConnected);

  const walletApiList = useStoreWallet((state) => state.walletApiList);
  const selectedApiVersion = useStoreWallet(
    (state) => state.selectedApiVersion
  );
  const setSelectedApiVersion = useStoreWallet(
    (state) => state.setSelectedApiVersion
  );
  const [selectedOption, setSelectedOption] = useState<number>(0);

  const handleSelectChange = (event: any) => {
    const selectedValue = Number(event.target.value);
    setSelectedOption(selectedValue);
    const correspondingString =
      selectedValue == 0 ? 'default' : walletApiList[selectedValue - 1];
    setSelectedApiVersion(correspondingString);
    console.log('selected value=', selectedValue, correspondingString);
  };

  return (
    <Provider>
      <div>
        <div>
          {!isConnected ? (
            <>
              <Center>
                <Button
                  variant='surface'
                  textDecoration='none !important'
                  fontWeight='bold'
                  outline='none !important'
                  boxShadow='none !important'
                  mt={3}
                  px={5}
                  onClick={() => setSelectWalletUI(true)}
                >
                  Connect a Wallet
                </Button>
                {displaySelectWalletUI && <SelectWallet></SelectWallet>}
              </Center>
            </>
          ) : (
            <Center>
              <Button
                variant='surface'
                textDecoration='none !important'
                fontWeight='bold'
                outline='none !important'
                boxShadow='none !important'
                mt={3}
                px={5}
                onClick={() => {
                  setConnected(false);
                  setSelectWalletUI(false);
                }}
              >
                {addressAccountFromContext
                  ? `Your wallet : ${addressAccountFromContext?.slice(0, 7)}...${addressAccountFromContext?.slice(-4)} is connected`
                  : 'No Account'}
              </Button>
            </Center>
          )}
        </div>
      </div>
    </Provider>
  );
}
