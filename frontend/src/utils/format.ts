/**
 * Shortens an Ethereum address to a readable format.
 * Example: 0x742d35Cc6634C0532925a3b844Bc454e4438f44e -> 0x742d...f44e
 * 
 * @param address The full Ethereum address
 * @param chars Number of characters to keep at the beginning and end
 * @returns The shortened address
 */
export const shortenAddress = (address: string, chars = 4): string => {
  if (!address) return '';
  if (address.length < 10) return address;
  
  const prefix = address.slice(0, chars + 2); // +2 for "0x"
  const suffix = address.slice(-chars);
  
  return `${prefix}...${suffix}`;
};

/**
 * Formats a number to a readable ETH value.
 * 
 * @param value The value to format
 * @param decimals Number of decimal places to show
 * @returns Formatted ETH value
 */
export const formatETH = (value: string | number, decimals = 4): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '0 ETH';
  
  return `${num.toFixed(decimals)} ETH`;
};

/**
 * Formats a timestamp to a readable date.
 * 
 * @param timestamp Unix timestamp in seconds
 * @returns Formatted date string
 */
export const formatDate = (timestamp: number): string => {
  // Convert seconds to milliseconds
  const date = new Date(timestamp * 1000);
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

/**
 * Formats a large number with commas.
 * Example: 1000000 -> 1,000,000
 * 
 * @param num The number to format
 * @returns The formatted number
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num);
}; 