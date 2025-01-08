import crypto from "crypto";

interface VideoData {
	Date: string;
	Link: string;
}

const MAX_CHUNK_SIZE = 190; // Max size for 2048 bit RSA
const MIN_CHUNK_SIZE = 50; // Minimum chunk size

function calculateOptimalChunkSize(dataLength: number): number {
	if (dataLength <= MAX_CHUNK_SIZE) return dataLength;
	const numChunks = Math.ceil(dataLength / MAX_CHUNK_SIZE);
	return Math.floor(dataLength / numChunks);
}

function stripVideoData(videoList: VideoData[]): VideoData[] {
	return videoList.map((video) => ({
		Date: video.Date,
		Link: video.Link,
	}));
}

function chunkString(str: string): string[] {
	const chunkSize = calculateOptimalChunkSize(str.length);
	const chunks: string[] = [];

	for (let i = 0; i < str.length; i += chunkSize) {
		chunks.push(str.slice(i, Math.min(i + chunkSize, str.length)));
	}

	return chunks;
}

export function encryptWithPublicKey(data: any): string[] {
	try {
		const publicKey = process.env.PUBLIC_KEY?.replace(/\\n/g, "\n");
		if (!publicKey) throw new Error("Public key not found");

		// Handle video list specifically
		const processedData = Array.isArray(data) ? stripVideoData(data) : data;
		const stringData = JSON.stringify(processedData);

		const chunks = chunkString(stringData);

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
		throw new Error(`Failed to encrypt data: ${error.message}`);
	}
}
