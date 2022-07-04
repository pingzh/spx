import React, { useState } from "react";
import { Keyboard } from 'react-native'
import {
  Text,
  Divider,
  HStack,
  Input,
  Heading,
  Switch,
  useColorMode,
  NativeBaseProvider,
  Pressable,
  VStack,
  Box,
  extendTheme,
} from "native-base";


const theme = extendTheme({
  // Make sure values below matches any of the keys in `fontConfig`
  fonts: {
    heading: "Courier New",
    body: "Courier New",
    mono: "Courier New",
  },
});

export default function App() {
  const [spxOpenPrice, setSpxOpenPrice] = useState(0);

  // round down to either 0 or 5 for puts
  // for example, if it is 2, --> 0, if it is 6 --> 5
  // round up to either 0 or 5 for calls
  function calculatePutRange(spxOpenPrice, perc) {
    if (spxOpenPrice == 0) {
      return "0"
    }
    const putLeg = (spxOpenPrice * (1 - perc / 100)) // .toFixed(2)
    const floor = Math.floor(putLeg)
    const lastDigit = floor % 10

    let legs = ""
    let upperLeg = floor;
    if (lastDigit > 5) {
      upperLeg = floor - (lastDigit - 5);
    } else if (lastDigit < 5) {
      upperLeg = floor - lastDigit;
    }
    legs = `${upperLeg - 5} - ${upperLeg}`

    return `${putLeg.toFixed(2)} @ ${legs}`
  }

  function calculateCallRange(spxOpenPrice, perc) {
    if (spxOpenPrice == 0) {
      return "0"
    }
    const callLeg = (spxOpenPrice * (1 + perc / 100));
    const ceil= Math.ceil(callLeg);
    const lastDigit = ceil % 10;

    let legs = "";
    let lowerLeg = ceil
    if (lastDigit > 5) {
      // so that 3876.40 (8) --> 3880 - 3885
      lowerLeg = ceil + (10 - lastDigit);
    } else if (lastDigit < 5 && lastDigit != 0) {
      // so that 3872.40 --> 3875 - 3880
      lowerLeg = ceil + (5 - lastDigit);
    }
    legs = `${lowerLeg} - ${lowerLeg + 5}`

    return `${callLeg.toFixed(2)} @ ${legs}`
  }

  // value, desc, textColor
  const dailyReturnStds = [[1.16, "Since 2020", "success.500"], [0.87, "Since 2012", "primary.500"], [1.50, "Conservative", "info.500"]]
  return (
    <NativeBaseProvider theme={theme}>
      <Box pt={10} pb={5} alignSelf="center">
        <HStack space={5} alignItems="center">
          <Heading size="lg">SPX Iron Conor Calculator</Heading>
        </HStack>
      </Box>

      <HStack space={2} alignItems="center" pl={8} mb={1}>
        <Text fontSize="xl" w="1/3" fontWeight="medium">SPX Open</Text>
        <Input fontSize="xl" keyboardType="decimal-pad" w="2/4" onChangeText={(newPrice) => setSpxOpenPrice(newPrice)}/>
      </HStack>

      <Pressable onPress={Keyboard.dismiss}>
      {dailyReturnStds.map(dailyReturnStd=>{
       return <VStack space={2}  w="100%" key={dailyReturnStd[0]}>
          <Divider my="2" />
          <HStack space={1} alignItems="center" pl={8}>
              <Text fontSize="xl"   w="1/4">Std: </Text>
              <Text fontSize="xl"  w="3/4" >{dailyReturnStd[0]} % ({dailyReturnStd[1]})</Text>
          </HStack>
          <HStack space={1} alignItems="center" pl={8}>
              <Text fontSize="xl"   w="1/4">Put: </Text>
              <Text fontSize="xl" color="secondary.400" w="3/4"  fontWeight="medium" >{calculatePutRange(spxOpenPrice, dailyReturnStd[0])} </Text>
          </HStack>
          <HStack space={1} alignItems="center" pl={8}>
              <Text  fontSize="xl"  w="1/4">Call: </Text>
              <Text fontSize="xl" color="tertiary.400" w="3/4"  fontWeight="medium" >{calculateCallRange(spxOpenPrice, dailyReturnStd[0])} </Text>
          </HStack>
        </VStack>
      })}
      </Pressable>


    </NativeBaseProvider>
  );
}
