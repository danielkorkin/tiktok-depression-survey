import crypto from "crypto";

const CHUNK_SIZE = 190; // Max size for 2048 bit RSA key with OAEP padding

interface VideoData {
	id: string;
	uploadDate: string;
}

function stripVideoData(videoList: any[]): VideoData[] {
	return videoList.map((video) => ({
		id: video.id,
		uploadDate: video.uploadDate,
	}));
}

function chunkString(str: string): string[] {
	const chunks: string[] = [];
	for (let i = 0; i < str.length; i += CHUNK_SIZE) {
		chunks.push(str.slice(i, i + CHUNK_SIZE));
	}
	return chunks;
}

export function encryptWithPublicKey(data: any): string[] {
	try {
		// Get public key from environment variable
		const publicKey = process.env.PUBLIC_KEY?.replace(/\\n/g, "\n") || "";

		// Strip down video data to essential fields only
		const strippedData = Array.isArray(data) ? stripVideoData(data) : data;

		// Convert data to string
		const stringData = JSON.stringify(strippedData);

		// Split into chunks
		const chunks = chunkString(stringData);

		// Encrypt each chunk
		return chunks.map((chunk) => {
			const encrypted = crypto.publicEncrypt(
				{
					key: publicKey,
					padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
					oaepHash: "sha256",
				},
				Buffer.from(chunk),
			);
			return encrypted.toString("base64");
		});
	} catch (error) {
		console.error("Encryption error:", error);
		throw new Error("Failed to encrypt data");
	}
}
