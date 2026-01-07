import { Box, InputGroup, InputLeftElement, Input } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'

/**
 * Search input component with icon
 * @param {Object} props - Component props
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.placeholder - Placeholder text
 */
const SearchInput = ({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <Box
      sx={{
        animation: 'slideIn 0.5s ease-out',
        '@keyframes slideIn': {
          from: { opacity: 0, transform: 'translateX(-20px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
      }}
    >
      <InputGroup size={{ base: 'md', md: 'lg' }}>
        <InputLeftElement pointerEvents="none" h="100%">
          <SearchIcon
            color="rgba(255, 255, 255, 0.5)"
            boxSize={{ base: 4, md: 5 }}
          />
        </InputLeftElement>
        <Input
          variant="netflix"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          size={{ base: 'md', md: 'lg' }}
          h={{ base: '44px', md: '56px' }}
          fontSize={{ base: '16px', md: '18px' }}
        />
      </InputGroup>
    </Box>
  )
}

export default SearchInput

