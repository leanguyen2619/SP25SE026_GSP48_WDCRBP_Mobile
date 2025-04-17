import { decode as base64Decode } from 'base-64';  // Base64 decoding for URL encoded data
import CryptoJS from 'crypto-js';  // Import CryptoJS for AES decryption

const AES_KEY = "YourSecretKey123";  // This is the same key used for encryption

// Function to decrypt the encrypted string
export const decrypt = (encryptedData) => {
  try {
    // Decode the base64 string
    const decodedData = base64Decode(encryptedData);
    
    // The first 12 bytes of the decoded data are the IV (Initialization Vector)
    const iv = decodedData.slice(0, 12);  // First 12 bytes are the IV
    
    // The remaining part of the data is the encrypted text
    const encryptedText = decodedData.slice(12);  // The rest is the encrypted text

    // Decrypt using CryptoJS.AES.decrypt method
    const decryptedText = CryptoJS.AES.decrypt(
      encryptedText,  // The encrypted text
      CryptoJS.enc.Utf8.parse(AES_KEY),  // The decryption key, parsed as a UTF-8 string
      { iv: CryptoJS.enc.Hex.parse(iv) }  // IV used in encryption
    ).toString(CryptoJS.enc.Utf8);  // Convert the decrypted text to a UTF-8 string

    return decryptedText;  // Return the decrypted text (string)
  } catch (error) {
    console.error("Decryption error: ", error);
    return null;  // Return null if there is an error during decryption
  }
};

// Optional: Function to decrypt multiple parameters from the URL (for parsing encrypted data)
export const decryptMultipleFromQuery = (queryString) => {
  const result = {};
  try {
    // Decode URL-encoded string
    const decodedQuery = decodeURIComponent(queryString);
    
    // Split the query string into key-value pairs
    const pairs = decodedQuery.split("&");
    
    // Loop through each pair and decrypt the value
    for (let pair of pairs) {
      const [param, encryptedValue] = pair.split("=");  // Split the pair into key and encrypted value
      if (encryptedValue) {
        const decryptedValue = decrypt(encryptedValue);  // Decrypt the value
        result[param] = decryptedValue;  // Add the decrypted value to the result object
      }
    }
  } catch (error) {
    console.error("Error in decrypting query parameters:", error);
  }
  return result;
};
