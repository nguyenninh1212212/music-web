// IPFS Upload Utilities using Pinata

import axios from "axios";

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;

if (!PINATA_JWT) {
  console.error("⚠️ VITE_PINATA_JWT not found in environment variables");
}

interface IPFSUploadResult {
  cid: string;
  ipfsUrl: string;
  gatewayUrl: string;
}

/**
 * Upload a file to IPFS via Pinata
 */
export async function uploadFileToIPFS(file: File): Promise<IPFSUploadResult> {
  if (!PINATA_JWT) {
    throw new Error("Missing VITE_PINATA_JWT environment variable");
  }

  console.log("📤 Uploading file to IPFS:", file.name);

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ Pinata upload failed:", errorText);
    throw new Error(`Failed to upload file to IPFS: ${errorText}`);
  }

  const data = await res.json();
  const ipfsHash = data.IpfsHash;

  return {
    cid: ipfsHash,
    ipfsUrl: `ipfs://${ipfsHash}`,
    gatewayUrl: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
  };
}

/**
 * Upload JSON metadata to IPFS via Pinata
 */
export async function uploadJSONToIPFS(metadata: any): Promise<string> {
  if (!PINATA_JWT) {
    throw new Error("Missing VITE_PINATA_JWT environment variable");
  }

  console.log("📤 Uploading metadata to IPFS:", metadata);

  const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: JSON.stringify({
      pinataContent: metadata,
      pinataMetadata: {
        name: metadata.name || "NFT Metadata",
      },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ Pinata JSON upload failed:", errorText);

    if (res.status === 403) {
      throw new Error("Invalid Pinata JWT or insufficient permissions");
    }

    throw new Error(`Failed to upload metadata to IPFS: ${errorText}`);
  }

  const data = await res.json();
  console.log("✅ Metadata uploaded, CID:", data.IpfsHash);

  return data.IpfsHash;
}

/**
 * Test Pinata connection
 */
export async function testPinataConnection(): Promise<boolean> {
  if (!PINATA_JWT) {
    console.error("❌ No Pinata JWT configured");
    return false;
  }

  try {
    const res = await fetch(
      "https://api.pinata.cloud/data/testAuthentication",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
        },
      }
    );

    if (res.ok) {
      console.log("✅ Pinata connection successful");
      return true;
    } else {
      console.error("❌ Pinata authentication failed");
      return false;
    }
  } catch (error) {
    console.error("❌ Pinata connection error:", error);
    return false;
  }
}

/**
 * Fetch JSON metadata from IPFS via Pinata gateway
 * @param cidOrUrl - IPFS CID (e.g., Qm...) or full URL
 */

export async function fetchJSONFromIPFS(cidOrUrl: string): Promise<any> {
  try {
    let url = cidOrUrl;

    // Chuyển ipfs:// hoặc CID thuần sang HTTPS gateway
    if (cidOrUrl.startsWith("ipfs://")) {
      url = cidOrUrl.replace(
        "ipfs://",
        "https://maroon-important-aphid-390.mypinata.cloud/ipfs/QmdL8QJ9w8d6LYZwi1tno64a4DToP62gRadM98RMd8qC2i"
      );
    } else if (!cidOrUrl.startsWith("http")) {
      url = `https://gateway.pinata.cloud/ipfs/${cidOrUrl}`;
    }

    console.log("📥 Fetching JSON from IPFS:", url);

    const  data  = await axios.get(
      "https://maroon-important-aphid-390.mypinata.cloud/ipfs/QmdL8QJ9w8d6LYZwi1tno64a4DToP62gRadM98RMd8qC2i",
      {
        headers: { Accept: "application/json" },
      }
    );

    console.log("✅ JSON fetched from IPFS:", data);
    return data;
  } catch (error: any) {
    console.error("❌ Error fetching JSON from IPFS:", error.message);
    throw error;
  }
}
