import { useState } from 'react'
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Box,
  Text,
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useRegion } from '../../contexts/RegionContext'
import { REGION_COUNTRIES } from '../../utils/regionConstants'

/**
 * Country/region selector for header
 * Shows current region; user can change to any country or Worldwide
 */
const CountryRegionSelector = () => {
  const { region, regionName, isLoading, setRegion } = useRegion()
  const toast = useToast()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSelect = (code) => {
    setRegion(code)
    setMenuOpen(false)
    toast({
      title: 'Region updated',
      description: `Showing trends for ${code === 'WW' ? 'Worldwide' : REGION_COUNTRIES.find((c) => c.code === code)?.name}`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    })
  }

  const handleOpen = () => {
    setMenuOpen(true)
  }

  return (
    <Menu
      placement="bottom-end"
      isLazy
      isOpen={menuOpen}
      onOpen={handleOpen}
      onClose={() => setMenuOpen(false)}
    >
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        size={{ base: 'sm', md: 'md' }}
        bg="rgba(255, 255, 255, 0.1)"
        color="white"
        _hover={{ bg: 'rgba(255, 255, 255, 0.2)' }}
        fontWeight="500"
        isLoading={isLoading}
        px={{ base: 2, md: 3 }}
        fontSize={{ base: 'xs', md: 'sm' }}
      >
        <Box as="span" display="flex" alignItems="center" gap={1}>
          <Text as="span" noOfLines={1} maxW={{ base: '60px', md: '100px' }}>
            {regionName}
          </Text>
        </Box>
      </MenuButton>
      <MenuList
        bg="#1a1a1a"
        borderColor="gray.700"
        maxH="300px"
        overflowY="auto"
      >
        {REGION_COUNTRIES.map((country) => (
          <MenuItem
            key={country.code}
            bg={region === country.code ? 'rgba(229, 9, 20, 0.2)' : 'transparent'}
            color="white"
            _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
            onClick={() => handleSelect(country.code)}
          >
            {country.name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}

export default CountryRegionSelector
